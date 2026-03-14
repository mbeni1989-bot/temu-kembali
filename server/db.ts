import { eq, and, or, desc, sql, like, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  reports, 
  claims, 
  chats, 
  messages, 
  comments, 
  notifications,
  reportFlags,
  InsertReport,
  InsertClaim,
  InsertChat,
  InsertMessage,
  InsertComment,
  InsertNotification,
  InsertReportFlag
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// USER OPERATIONS
// ============================================================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "passwordHash", "phone", "avatar", "location"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user by email: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(userId: string, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(users).set(data).where(eq(users.id, userId));
}

export async function verifyUserAccount(userId: string, data: { phoneNumber: string; ktpNumber: string; ktpPhotoUrl: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(users).set({
    phone: data.phoneNumber,
    isVerified: true,
  }).where(eq(users.id, userId));
  
  // In production, also store KTP data securely
  // For now, we just mark the user as verified
}

// ============================================================================
// REPORT OPERATIONS
// ============================================================================

export async function createReport(report: InsertReport) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(reports).values(report);
  return report;
}

export async function getReportById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(reports)
    .where(eq(reports.id, id))
    .limit(1);
  
  return result[0];
}

export async function getReportsByUser(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(reports)
    .where(eq(reports.userId, userId))
    .orderBy(desc(reports.createdAt));
}

export async function getReportsByType(type: "lost_item" | "found_item" | "lost_person" | "find_person", filters?: {
  category?: "barang" | "hewan" | "kendaraan" | "orang";
  city?: string;
  province?: string;
  status?: "active" | "resolved" | "closed";
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [
    eq(reports.type, type),
    eq(reports.isPublished, true)
  ];
  
  if (filters?.category) conditions.push(eq(reports.category, filters.category));
  if (filters?.city) conditions.push(eq(reports.city, filters.city));
  if (filters?.province) conditions.push(eq(reports.province, filters.province));
  if (filters?.status) conditions.push(eq(reports.status, filters.status));
  
  const baseQuery = db
    .select()
    .from(reports)
    .where(and(...conditions))
    .orderBy(desc(reports.createdAt));
  
  if (filters?.limit) {
    return await baseQuery.limit(filters.limit);
  }
  
  return await baseQuery;
}

export async function searchReports(searchTerm: string, filters?: {
  type?: "lost_item" | "found_item" | "lost_person" | "find_person";
  category?: "barang" | "hewan" | "kendaraan" | "orang";
  city?: string;
}) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(reports)
    .where(
      and(
        eq(reports.isPublished, true),
        or(
          like(reports.title, `%${searchTerm}%`),
          like(reports.description, `%${searchTerm}%`)
        ),
        filters?.type ? eq(reports.type, filters.type) : undefined,
        filters?.category ? eq(reports.category, filters.category) : undefined,
        filters?.city ? eq(reports.city, filters.city) : undefined
      )
    )
    .orderBy(desc(reports.createdAt))
    .limit(50);
}

export async function updateReport(id: string, data: Partial<InsertReport>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(reports).set(data).where(eq(reports.id, id));
}

export async function incrementReportViews(id: string) {
  const db = await getDb();
  if (!db) return;
  
  await db
    .update(reports)
    .set({ viewCount: sql`${reports.viewCount} + 1` })
    .where(eq(reports.id, id));
}

// ============================================================================
// CLAIM OPERATIONS
// ============================================================================

export async function createClaim(claim: InsertClaim) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(claims).values(claim);
  return claim;
}

export async function getClaimById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(claims)
    .where(eq(claims.id, id))
    .limit(1);
  
  return result[0];
}

export async function getClaimsByReport(reportId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(claims)
    .where(eq(claims.reportId, reportId))
    .orderBy(desc(claims.createdAt));
}

export async function getClaimsByUser(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(claims)
    .where(eq(claims.claimantId, userId))
    .orderBy(desc(claims.createdAt));
}

export async function updateClaim(id: string, data: Partial<InsertClaim>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(claims).set(data).where(eq(claims.id, id));
}

// ============================================================================
// CHAT OPERATIONS
// ============================================================================

export async function createChat(chat: InsertChat) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(chats).values(chat);
  return chat;
}

export async function getChatById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(chats)
    .where(eq(chats.id, id))
    .limit(1);
  
  return result[0];
}

export async function getChatsByUser(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(chats)
    .where(
      and(
        or(
          eq(chats.user1Id, userId),
          eq(chats.user2Id, userId)
        ),
        eq(chats.isActive, true)
      )
    )
    .orderBy(desc(chats.lastMessageAt));
}

export async function findExistingChat(reportId: string, user1Id: string, user2Id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(chats)
    .where(
      and(
        eq(chats.reportId, reportId),
        or(
          and(eq(chats.user1Id, user1Id), eq(chats.user2Id, user2Id)),
          and(eq(chats.user1Id, user2Id), eq(chats.user2Id, user1Id))
        )
      )
    )
    .limit(1);
  
  return result[0];
}

// ============================================================================
// MESSAGE OPERATIONS
// ============================================================================

export async function createMessage(message: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(messages).values(message);
  
  // Update chat's lastMessageAt
  await db
    .update(chats)
    .set({ lastMessageAt: new Date() })
    .where(eq(chats.id, message.chatId));
  
  return message;
}

export async function getMessagesByChat(chatId: string, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(desc(messages.createdAt))
    .limit(limit);
}

export async function markMessagesAsRead(chatId: string, userId: string) {
  const db = await getDb();
  if (!db) return;
  
  await db
    .update(messages)
    .set({ isRead: true, readAt: new Date() })
    .where(
      and(
        eq(messages.chatId, chatId),
        sql`${messages.senderId} != ${userId}`,
        eq(messages.isRead, false)
      )
    );
}

// ============================================================================
// COMMENT OPERATIONS
// ============================================================================

export async function createComment(comment: InsertComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(comments).values(comment);
  return comment;
}

export async function getCommentsByReport(reportId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(comments)
    .where(eq(comments.reportId, reportId))
    .orderBy(desc(comments.createdAt));
}

export async function updateComment(id: string, data: Partial<InsertComment>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(comments).set(data).where(eq(comments.id, id));
}

// ============================================================================
// NOTIFICATION OPERATIONS
// ============================================================================

export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(notifications).values(notification);
  return notification;
}

export async function getNotificationsByUser(userId: string, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function getUnreadNotificationsCount(userId: string) {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      )
    );
  
  return result[0]?.count || 0;
}

export async function markNotificationAsRead(id: string) {
  const db = await getDb();
  if (!db) return;
  
  await db
    .update(notifications)
    .set({ isRead: true, readAt: new Date() })
    .where(eq(notifications.id, id));
}

export async function markAllNotificationsAsRead(userId: string) {
  const db = await getDb();
  if (!db) return;
  
  await db
    .update(notifications)
    .set({ isRead: true, readAt: new Date() })
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      )
    );
}

// ============================================================================
// REPORT FLAG OPERATIONS
// ============================================================================

export async function createReportFlag(flag: InsertReportFlag) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(reportFlags).values(flag);
  return flag;
}

export async function getReportFlags(status?: "pending" | "reviewed" | "dismissed") {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(reportFlags)
    .where(status ? eq(reportFlags.status, status) : undefined)
    .orderBy(desc(reportFlags.createdAt));
}

export async function updateReportFlag(id: string, data: Partial<InsertReportFlag>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(reportFlags).set(data).where(eq(reportFlags.id, id));
}

