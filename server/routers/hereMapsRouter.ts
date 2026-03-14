import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { TRPCError } from '@trpc/server';

const HERE_API_KEY = process.env.HERE_API_KEY;

/**
 * HERE Maps Router
 * 
 * Backend proxy for HERE Maps API to keep API key secure
 * Prevents client-side exposure of API key
 */

export const hereMapsRouter = router({
  /**
   * Geocode - Convert address to coordinates
   */
  geocode: publicProcedure
    .input(z.object({
      query: z.string().min(1).max(500),
      limit: z.number().min(1).max(10).optional().default(5),
    }))
    .query(async ({ input }) => {
      if (!HERE_API_KEY) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'HERE Maps API key not configured',
        });
      }

      try {
        const url = new URL('https://geocode.search.hereapi.com/v1/geocode');
        url.searchParams.set('q', input.query);
        url.searchParams.set('limit', input.limit.toString());
        url.searchParams.set('apiKey', HERE_API_KEY);

        const response = await fetch(url.toString());
        
        if (!response.ok) {
          throw new Error(`HERE API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error: any) {
        console.error('[HERE Maps] Geocode error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to geocode address',
        });
      }
    }),

  /**
   * Reverse Geocode - Convert coordinates to address
   */
  reverseGeocode: publicProcedure
    .input(z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    }))
    .query(async ({ input }) => {
      if (!HERE_API_KEY) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'HERE Maps API key not configured',
        });
      }

      try {
        const url = new URL('https://revgeocode.search.hereapi.com/v1/revgeocode');
        url.searchParams.set('at', `${input.lat},${input.lng}`);
        url.searchParams.set('apiKey', HERE_API_KEY);

        const response = await fetch(url.toString());
        
        if (!response.ok) {
          throw new Error(`HERE API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error: any) {
        console.error('[HERE Maps] Reverse geocode error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to reverse geocode coordinates',
        });
      }
    }),

  /**
   * Autocomplete - Get address suggestions
   */
  autocomplete: publicProcedure
    .input(z.object({
      query: z.string().min(1).max(200),
      at: z.string().optional(), // lat,lng for location bias
      limit: z.number().min(1).max(10).optional().default(5),
    }))
    .query(async ({ input }) => {
      if (!HERE_API_KEY) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'HERE Maps API key not configured',
        });
      }

      try {
        const url = new URL('https://autocomplete.search.hereapi.com/v1/autocomplete');
        url.searchParams.set('q', input.query);
        url.searchParams.set('limit', input.limit.toString());
        if (input.at) {
          url.searchParams.set('at', input.at);
        }
        url.searchParams.set('apiKey', HERE_API_KEY);

        const response = await fetch(url.toString());
        
        if (!response.ok) {
          throw new Error(`HERE API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error: any) {
        console.error('[HERE Maps] Autocomplete error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get autocomplete suggestions',
        });
      }
    }),

  /**
   * Lookup - Get details for a specific location ID
   */
  lookup: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }) => {
      if (!HERE_API_KEY) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'HERE Maps API key not configured',
        });
      }

      try {
        const url = new URL('https://lookup.search.hereapi.com/v1/lookup');
        url.searchParams.set('id', input.id);
        url.searchParams.set('apiKey', HERE_API_KEY);

        const response = await fetch(url.toString());
        
        if (!response.ok) {
          throw new Error(`HERE API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error: any) {
        console.error('[HERE Maps] Lookup error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to lookup location',
        });
      }
    }),
});
