import { getDb } from "./db";
import { reports } from "../drizzle/schema";
import { eq, and, gte, sql } from "drizzle-orm";

/**
 * Check if user has exceeded daily report limit (3 reports per day)
 */
export async function checkDailyReportLimit(userId: string): Promise<{ allowed: boolean; count: number; limit: number }> {
  const db = await getDb();
  if (!db) {
    return { allowed: true, count: 0, limit: 3 };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(reports)
      .where(
        and(
          eq(reports.userId, userId),
          gte(reports.createdAt, today)
        )
      );

    const count = Number(result[0]?.count || 0);
    const limit = 3;

    return {
      allowed: count < limit,
      count,
      limit,
    };
  } catch (error) {
    console.error("[Report Limits] Failed to check daily limit:", error);
    return { allowed: true, count: 0, limit: 3 };
  }
}

/**
 * Check if user has exceeded monthly report limit (7 reports per month)
 */
export async function checkMonthlyReportLimit(userId: string): Promise<{ allowed: boolean; count: number; limit: number }> {
  const db = await getDb();
  if (!db) {
    return { allowed: true, count: 0, limit: 7 };
  }

  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(reports)
      .where(
        and(
          eq(reports.userId, userId),
          gte(reports.createdAt, firstDayOfMonth)
        )
      );

    const count = Number(result[0]?.count || 0);
    const limit = 7;

    return {
      allowed: count < limit,
      count,
      limit,
    };
  } catch (error) {
    console.error("[Report Limits] Failed to check monthly limit:", error);
    return { allowed: true, count: 0, limit: 7 };
  }
}

/**
 * Check both daily and monthly limits
 */
export async function checkReportLimits(userId: string): Promise<{
  allowed: boolean;
  dailyCount: number;
  dailyLimit: number;
  monthlyCount: number;
  monthlyLimit: number;
  reason?: string;
}> {
  const daily = await checkDailyReportLimit(userId);
  const monthly = await checkMonthlyReportLimit(userId);

  if (!daily.allowed) {
    return {
      allowed: false,
      dailyCount: daily.count,
      dailyLimit: daily.limit,
      monthlyCount: monthly.count,
      monthlyLimit: monthly.limit,
      reason: `Daily limit reached: ${daily.count}/${daily.limit} reports today`,
    };
  }

  if (!monthly.allowed) {
    return {
      allowed: false,
      dailyCount: daily.count,
      dailyLimit: daily.limit,
      monthlyCount: monthly.count,
      monthlyLimit: monthly.limit,
      reason: `Monthly limit reached: ${monthly.count}/${monthly.limit} reports this month`,
    };
  }

  return {
    allowed: true,
    dailyCount: daily.count,
    dailyLimit: daily.limit,
    monthlyCount: monthly.count,
    monthlyLimit: monthly.limit,
  };
}

