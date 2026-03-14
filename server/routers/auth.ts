import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { z } from "zod";
import { authService } from "../_core/auth";
import { getSessionCookieOptions } from "../_core/cookies";
import { publicProcedure, router } from "../_core/trpc";

export const authRouter = router({
  /**
   * Register a new user with email and password
   */
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        name: z.string().min(1, "Name is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { user, sessionToken } = await authService.register(
          input.email,
          input.password,
          input.name
        );

        // Set session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        return {
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Registration failed");
      }
    }),

  /**
   * Login with email and password
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(1, "Password is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { user, sessionToken } = await authService.login(
          input.email,
          input.password
        );

        // Set session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        return {
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Login failed");
      }
    }),

  /**
   * Logout - clear session cookie
   */
  logout: publicProcedure.mutation(async ({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, cookieOptions);

    return {
      success: true,
    };
  }),

  /**
   * Get current user info
   */
  me: publicProcedure.query(async ({ ctx }) => {
    try {
      const user = await authService.authenticateRequest(ctx.req);
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          emailVerified: user.emailVerified,
          avatar: user.avatar,
          reputationScore: user.reputationScore,
        },
      };
    } catch (error) {
      return { user: null };
    }
  }),
});
