import { mysqlEnum, mysqlTable, text, timestamp, varchar, int, boolean, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
  
  // Additional user profile fields
  phone: varchar("phone", { length: 20 }),
  avatar: text("avatar"),
  location: text("location"), // User's general location (city/province)
  isVerified: boolean("isVerified").default(false), // ID verification status
  verificationDocUrl: text("verificationDocUrl"), // KTP/SIM document URL
  reputationScore: int("reputationScore").default(0), // Reputation points
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Reports table - unified table for all types of reports
 * Types: lost_item, found_item, lost_person, find_person
 */
export const reports = mysqlTable("reports", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull().references(() => users.id),
  
  // Report type and category
  type: mysqlEnum("type", ["lost_item", "found_item", "lost_person", "find_person"]).notNull(),
  category: mysqlEnum("category", ["barang", "hewan", "kendaraan", "orang"]).notNull(),
  
  // Basic information
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  
  // Location data
  locationName: text("locationName"), // Human-readable location
  locationLat: varchar("locationLat", { length: 50 }),
  locationLng: varchar("locationLng", { length: 50 }),
  city: varchar("city", { length: 100 }),
  province: varchar("province", { length: 100 }),
  
  // Date/time information
  incidentDate: timestamp("incidentDate"), // When item was lost/found or person went missing
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  
  // Item-specific fields (for barang, hewan, kendaraan)
  itemBrand: varchar("itemBrand", { length: 100 }),
  itemColor: varchar("itemColor", { length: 100 }),
  itemModel: varchar("itemModel", { length: 100 }),
  
  // Animal-specific fields
  animalType: varchar("animalType", { length: 100 }), // dog, cat, bird, etc.
  animalBreed: varchar("animalBreed", { length: 100 }),
  animalName: varchar("animalName", { length: 100 }),
  
  // Vehicle-specific fields
  vehicleType: varchar("vehicleType", { length: 50 }), // motor, mobil
  vehiclePlate: varchar("vehiclePlate", { length: 20 }),
  
  // Person-specific fields
  personName: varchar("personName", { length: 255 }),
  personNickname: varchar("personNickname", { length: 100 }),
  personAge: int("personAge"),
  personGender: mysqlEnum("personGender", ["male", "female"]),
  personHeight: int("personHeight"), // in cm
  personWeight: int("personWeight"), // in kg
  personPhysicalFeatures: text("personPhysicalFeatures"),
  personLastWearing: text("personLastWearing"),
  personRelationship: varchar("personRelationship", { length: 100 }), // For find_person: friend, classmate, etc.
  personLastKnownInfo: text("personLastKnownInfo"), // For find_person: last known information
  
  // Police report (for lost_person)
  policeReportNumber: varchar("policeReportNumber", { length: 100 }),
  
  // Media
  images: text("images"), // JSON array of image URLs
  
  // Status
  status: mysqlEnum("status", ["active", "resolved", "closed"]).default("active").notNull(),
  resolvedAt: timestamp("resolvedAt"),
  
  // Reward (optional)
  hasReward: boolean("hasReward").default(false),
  rewardAmount: int("rewardAmount"),
  
  // Visibility and moderation
  isPublished: boolean("isPublished").default(true),
  isFlagged: boolean("isFlagged").default(false),
  flagReason: text("flagReason"),
  
  // View count for analytics
  viewCount: int("viewCount").default(0),
}, (table) => ({
  userIdIdx: index("userId_idx").on(table.userId),
  typeIdx: index("type_idx").on(table.type),
  categoryIdx: index("category_idx").on(table.category),
  statusIdx: index("status_idx").on(table.status),
  cityIdx: index("city_idx").on(table.city),
  createdAtIdx: index("createdAt_idx").on(table.createdAt),
}));

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

/**
 * Claims table - when someone claims to have found/lost something
 */
export const claims = mysqlTable("claims", {
  id: varchar("id", { length: 64 }).primaryKey(),
  reportId: varchar("reportId", { length: 64 }).notNull().references(() => reports.id),
  claimantId: varchar("claimantId", { length: 64 }).notNull().references(() => users.id),
  
  message: text("message"), // Initial claim message
  status: mysqlEnum("status", ["pending", "accepted", "rejected", "completed"]).default("pending").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  
  // Verification details (filled after acceptance)
  verificationDetails: text("verificationDetails"),
  completedAt: timestamp("completedAt"),
}, (table) => ({
  reportIdIdx: index("reportId_idx").on(table.reportId),
  claimantIdIdx: index("claimantId_idx").on(table.claimantId),
  statusIdx: index("status_idx").on(table.status),
}));

export type Claim = typeof claims.$inferSelect;
export type InsertClaim = typeof claims.$inferInsert;

/**
 * Chats table - conversation rooms between users
 */
export const chats = mysqlTable("chats", {
  id: varchar("id", { length: 64 }).primaryKey(),
  reportId: varchar("reportId", { length: 64 }).notNull().references(() => reports.id),
  claimId: varchar("claimId", { length: 64 }).references(() => claims.id),
  
  // Participants
  user1Id: varchar("user1Id", { length: 64 }).notNull().references(() => users.id),
  user2Id: varchar("user2Id", { length: 64 }).notNull().references(() => users.id),
  
  createdAt: timestamp("createdAt").defaultNow(),
  lastMessageAt: timestamp("lastMessageAt").defaultNow(),
  
  // Status
  isActive: boolean("isActive").default(true),
}, (table) => ({
  reportIdIdx: index("reportId_idx").on(table.reportId),
  user1IdIdx: index("user1Id_idx").on(table.user1Id),
  user2IdIdx: index("user2Id_idx").on(table.user2Id),
}));

export type Chat = typeof chats.$inferSelect;
export type InsertChat = typeof chats.$inferInsert;

/**
 * Messages table - individual messages in chats
 */
export const messages = mysqlTable("messages", {
  id: varchar("id", { length: 64 }).primaryKey(),
  chatId: varchar("chatId", { length: 64 }).notNull().references(() => chats.id),
  senderId: varchar("senderId", { length: 64 }).notNull().references(() => users.id),
  
  content: text("content").notNull(),
  messageType: mysqlEnum("messageType", ["text", "image", "system"]).default("text").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow(),
  
  // Read status
  isRead: boolean("isRead").default(false),
  readAt: timestamp("readAt"),
  
  // Flagging for moderation
  isFlagged: boolean("isFlagged").default(false),
  flagReason: text("flagReason"),
}, (table) => ({
  chatIdIdx: index("chatId_idx").on(table.chatId),
  senderIdIdx: index("senderId_idx").on(table.senderId),
  createdAtIdx: index("createdAt_idx").on(table.createdAt),
}));

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Comments table - public comments on reports (mainly for lost_person and find_person)
 */
export const comments = mysqlTable("comments", {
  id: varchar("id", { length: 64 }).primaryKey(),
  reportId: varchar("reportId", { length: 64 }).notNull().references(() => reports.id),
  userId: varchar("userId", { length: 64 }).notNull().references(() => users.id),
  
  content: text("content").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  
  // Moderation
  isFlagged: boolean("isFlagged").default(false),
  flagReason: text("flagReason"),
}, (table) => ({
  reportIdIdx: index("reportId_idx").on(table.reportId),
  userIdIdx: index("userId_idx").on(table.userId),
}));

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

/**
 * Notifications table
 */
export const notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull().references(() => users.id),
  
  type: mysqlEnum("type", [
    "new_claim",
    "claim_accepted",
    "claim_rejected",
    "new_message",
    "new_comment",
    "potential_match",
    "report_resolved",
    "new_report_nearby"
  ]).notNull(),
  
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  
  // Related entities
  reportId: varchar("reportId", { length: 64 }).references(() => reports.id),
  claimId: varchar("claimId", { length: 64 }).references(() => claims.id),
  chatId: varchar("chatId", { length: 64 }).references(() => chats.id),
  
  isRead: boolean("isRead").default(false),
  readAt: timestamp("readAt"),
  
  createdAt: timestamp("createdAt").defaultNow(),
}, (table) => ({
  userIdIdx: index("userId_idx").on(table.userId),
  isReadIdx: index("isRead_idx").on(table.isRead),
  createdAtIdx: index("createdAt_idx").on(table.createdAt),
}));

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Report flags/reports from users
 */
export const reportFlags = mysqlTable("reportFlags", {
  id: varchar("id", { length: 64 }).primaryKey(),
  reportId: varchar("reportId", { length: 64 }).notNull().references(() => reports.id),
  reporterId: varchar("reporterId", { length: 64 }).notNull().references(() => users.id),
  
  reason: mysqlEnum("reason", [
    "fake",
    "spam",
    "inappropriate",
    "duplicate",
    "resolved",
    "other"
  ]).notNull(),
  description: text("description"),
  
  status: mysqlEnum("status", ["pending", "reviewed", "dismissed"]).default("pending").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow(),
  reviewedAt: timestamp("reviewedAt"),
  reviewedBy: varchar("reviewedBy", { length: 64 }).references(() => users.id),
}, (table) => ({
  reportIdIdx: index("reportId_idx").on(table.reportId),
  statusIdx: index("status_idx").on(table.status),
}));

export type ReportFlag = typeof reportFlags.$inferSelect;
export type InsertReportFlag = typeof reportFlags.$inferInsert;

