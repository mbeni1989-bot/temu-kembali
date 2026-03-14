export const ENV = {
  // OAuth removed - using email/password authentication
  // appId: process.env.VITE_APP_ID ?? "",
  // oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  ownerId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};
