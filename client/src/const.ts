export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "App";

export const APP_LOGO =
  import.meta.env.VITE_APP_LOGO ||
  "https://placehold.co/128x128/E1E7EF/1F2937?text=App";

// Authentication is now handled via email/password login
// Redirect to internal login page instead of external OAuth
export const getLoginUrl = () => "/login";

/** Path yang tidak butuh login — 401 di sini jangan trigger redirect (cegah refresh loop) */
const PUBLIC_PATHS_EXACT = [
  "/",
  "/login",
  "/register",
  "/explore",
  "/donate",
  "/terms",
  "/privacy",
  "/404",
  "/verify-email",
  "/verify-account",
] as const;
const PUBLIC_PATH_PREFIX = "/report/";

/** Cek apakah pathname adalah halaman publik (redirect 401 otomatis tidak dilakukan) */
export function isPublicPath(pathname: string): boolean {
  const p = pathname.replace(/\/$/, "") || "/";
  if ((PUBLIC_PATHS_EXACT as readonly string[]).includes(p)) return true;
  if (p.startsWith(PUBLIC_PATH_PREFIX)) return true;
  return false;
}