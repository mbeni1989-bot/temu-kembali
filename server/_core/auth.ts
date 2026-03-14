import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";
import bcrypt from "bcryptjs";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { SignJWT, jwtVerify } from "jose";
import { customAlphabet } from "nanoid";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 16);

const SALT_ROUNDS = 10;

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

export class AuthService {
  private getSessionSecret() {
    const secret = ENV.cookieSecret;
    if (!secret) {
      throw new Error("JWT_SECRET environment variable is not set");
    }
    return new TextEncoder().encode(secret);
  }

  /**
   * Hash a password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Verify a password against a hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Create a session token for a user
   */
  async createSessionToken(
    userId: string,
    email: string,
    name: string,
    options: { expiresInMs?: number } = {}
  ): Promise<string> {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
    const secretKey = this.getSessionSecret();

    return new SignJWT({
      userId,
      email,
      name,
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(expirationSeconds)
      .sign(secretKey);
  }

  /**
   * Verify a session token
   */
  async verifySession(
    cookieValue: string | undefined | null
  ): Promise<SessionPayload | null> {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }

    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"],
      });
      const { userId, email, name } = payload as Record<string, unknown>;

      if (
        !isNonEmptyString(userId) ||
        !isNonEmptyString(email) ||
        !isNonEmptyString(name)
      ) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }

      return {
        userId,
        email,
        name,
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }

  /**
   * Parse cookies from request header
   */
  private parseCookies(cookieHeader: string | undefined) {
    if (!cookieHeader) {
      return new Map<string, string>();
    }

    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }

  /**
   * Authenticate a request and return the user
   */
  async authenticateRequest(req: Request): Promise<User> {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);

    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }

    const user = await db.getUser(session.userId);

    if (!user) {
      throw ForbiddenError("User not found");
    }

    // Update last signed in
    await db.upsertUser({
      id: user.id,
      lastSignedIn: new Date(),
    });

    return user;
  }

  /**
   * Register a new user with email and password
   */
  async register(
    email: string,
    password: string,
    name: string
  ): Promise<{ user: User; sessionToken: string }> {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Validate password strength
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const userId = nanoid();
    await db.upsertUser({
      id: userId,
      email,
      name,
      passwordHash,
      loginMethod: "email",
      emailVerified: false,
      lastSignedIn: new Date(),
    });

    const user = await db.getUser(userId);
    if (!user) {
      throw new Error("Failed to create user");
    }

    // Create session token
    const sessionToken = await this.createSessionToken(userId, email, name);

    return { user, sessionToken };
  }

  /**
   * Login a user with email and password
   */
  async login(
    email: string,
    password: string
  ): Promise<{ user: User; sessionToken: string }> {
    // Find user by email
    const user = await db.getUserByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check if user has password hash (email/password login)
    if (!user.passwordHash) {
      throw new Error("This account uses a different login method");
    }

    // Verify password
    const isValid = await this.verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    // Update last signed in
    await db.upsertUser({
      id: user.id,
      lastSignedIn: new Date(),
    });

    // Create session token
    const sessionToken = await this.createSessionToken(
      user.id,
      user.email!,
      user.name || ""
    );

    return { user, sessionToken };
  }
}

export const authService = new AuthService();
