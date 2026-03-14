/**
 * HERE Maps Geocoding & Search Service
 * 
 * SECURITY FIX: Now uses backend proxy instead of direct API calls
 * API key is kept secure on server-side only (not exposed in client bundle)
 */

import { trpc } from './trpc';

interface HerePosition {
  lat: number;
  lng: number;
}

interface HereAddress {
  label: string;
  countryCode?: string;
  countryName?: string;
  state?: string;
  county?: string;
  city?: string;
  district?: string;
  street?: string;
  postalCode?: string;
  houseNumber?: string;
}

export interface HereGeocodingResult {
  title: string;
  id: string;
  resultType: string;
  address: HereAddress;
  position: HerePosition;
  distance?: number;
  access?: HerePosition[];
}

interface AutosuggestOptions {
  at?: [number, number]; // [lng, lat] - bias results towards this location
  limit?: number; // Max number of results (default: 5)
  lang?: string; // Language code (e.g., 'id' for Indonesian, 'en' for English)
  in?: string; // Country code (e.g., 'countryCode:IDN' for Indonesia)
}

/**
 * Autosuggest - Search as you type with POI support
 * Uses backend proxy for security
 */
export const hereAutosuggest = async (
  query: string,
  options: AutosuggestOptions = {}
): Promise<HereGeocodingResult[]> => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const at = options.at ? `${options.at[1]},${options.at[0]}` : undefined;
    
    const response = await trpc.hereMaps.autocomplete.query({
      query,
      at,
      limit: options.limit || 5,
    });

    return response.items || [];
  } catch (error) {
    console.error('[HERE] Autosuggest error:', error);
    return [];
  }
};

/**
 * Discover - Search for places and POI with detailed results
 * Uses backend proxy for security
 */
export const hereDiscover = async (
  query: string,
  options: AutosuggestOptions = {}
): Promise<HereGeocodingResult[]> => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    // Use autocomplete endpoint (HERE Maps autocomplete includes POI)
    const at = options.at ? `${options.at[1]},${options.at[0]}` : undefined;
    
    const response = await trpc.hereMaps.autocomplete.query({
      query,
      at,
      limit: options.limit || 5,
    });

    return response.items || [];
  } catch (error) {
    console.error('[HERE] Discover error:', error);
    return [];
  }
};

/**
 * Reverse Geocoding - Convert coordinates to address
 * Uses backend proxy for security
 */
export const hereReverseGeocode = async (
  lng: number,
  lat: number
): Promise<HereGeocodingResult | null> => {
  try {
    const response = await trpc.hereMaps.reverseGeocode.query({
      lat,
      lng,
    });

    return response.items?.[0] || null;
  } catch (error) {
    console.error('[HERE] Reverse geocoding error:', error);
    return null;
  }
};

/**
 * Forward Geocoding - Convert address to coordinates
 * Uses backend proxy for security
 */
export const hereGeocode = async (
  query: string,
  options: AutosuggestOptions = {}
): Promise<HereGeocodingResult[]> => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const response = await trpc.hereMaps.geocode.query({
      query,
      limit: options.limit || 5,
    });

    return response.items || [];
  } catch (error) {
    console.error('[HERE] Geocoding error:', error);
    return [];
  }
};

/**
 * Lookup location details by ID
 * Uses backend proxy for security
 */
export const hereLookup = async (id: string): Promise<HereGeocodingResult | null> => {
  try {
    const response = await trpc.hereMaps.lookup.query({ id });
    return response || null;
  } catch (error) {
    console.error('[HERE] Lookup error:', error);
    return null;
  }
};

/**
 * Get user's current location
 * @returns Promise with [lng, lat] or null if unavailable
 */
export const getCurrentLocation = (): Promise<[number, number] | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('[Geolocation] Not supported by browser');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve([position.coords.longitude, position.coords.latitude]);
      },
      (error) => {
        console.error('[Geolocation] Error:', error.message);
        resolve(null);
      },
      {
        timeout: 5000,
        maximumAge: 60000, // Cache for 1 minute
        enableHighAccuracy: false, // Faster, less battery drain
      }
    );
  });
};
