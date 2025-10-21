import geoip from "geoip-lite";
import { Request, Response, NextFunction } from "express";

/**
 * Geo-blocking middleware
 * Block or allow specific countries
 */

// Countries to block (ISO 3166-1 alpha-2 codes)
// Example: ["CN", "RU", "KP"] - China, Russia, North Korea
const BLOCKED_COUNTRIES: string[] = process.env.BLOCKED_COUNTRIES?.split(",") || [];

// Countries to allow (if set, only these countries are allowed)
const ALLOWED_COUNTRIES: string[] = process.env.ALLOWED_COUNTRIES?.split(",") || [];

/**
 * Get country from IP address
 */
export function getCountryFromIP(ip: string): string | null {
  try {
    const geo = geoip.lookup(ip);
    return geo?.country || null;
  } catch (error) {
    console.error("[Geo-blocking] Failed to lookup IP:", error);
    return null;
  }
}

/**
 * Check if IP is blocked
 */
export function isIPBlocked(ip: string): boolean {
  const country = getCountryFromIP(ip);
  
  if (!country) {
    // If we can't determine country, allow by default
    return false;
  }

  // If allowed countries list is set, check if country is in the list
  if (ALLOWED_COUNTRIES.length > 0) {
    return !ALLOWED_COUNTRIES.includes(country);
  }

  // Otherwise, check if country is in blocked list
  return BLOCKED_COUNTRIES.includes(country);
}

/**
 * Geo-blocking middleware for Express
 */
export function geoBlockingMiddleware(req: Request, res: Response, next: NextFunction) {
  // Skip in development
  if (process.env.NODE_ENV === "development") {
    return next();
  }

  const ip = req.ip || req.socket.remoteAddress || "";
  
  if (isIPBlocked(ip)) {
    const country = getCountryFromIP(ip);
    console.warn(`[Geo-blocking] Blocked request from ${country} (${ip})`);
    
    return res.status(403).json({
      error: "Access Denied",
      message: "Access from your location is not permitted.",
      code: "GEO_BLOCKED",
    });
  }

  next();
}

/**
 * Get geo information from IP
 */
export function getGeoInfo(ip: string) {
  try {
    const geo = geoip.lookup(ip);
    
    if (!geo) {
      return null;
    }

    return {
      country: geo.country,
      region: geo.region,
      city: geo.city,
      timezone: geo.timezone,
      coordinates: geo.ll, // [latitude, longitude]
    };
  } catch (error) {
    console.error("[Geo-blocking] Failed to get geo info:", error);
    return null;
  }
}

