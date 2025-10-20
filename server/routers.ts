import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { nanoid } from "nanoid";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============================================================================
  // USER ROUTER
  // ============================================================================
  user: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUser(ctx.user.id);
    }),

    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        location: z.string().optional(),
        avatar: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),

    verifyAccount: protectedProcedure
      .input(z.object({
        phoneNumber: z.string(),
        ktpNumber: z.string(),
        ktpPhotoUrl: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.verifyUserAccount(ctx.user.id, input);
        return { success: true };
      }),
  }),

  // ============================================================================
  // REPORTS ROUTER
  // ============================================================================
  reports: router({
    create: protectedProcedure
      .input(z.object({
        type: z.enum(["lost_item", "found_item", "lost_person", "find_person"]),
        category: z.enum(["barang", "hewan", "kendaraan", "orang"]),
        title: z.string().min(5).max(255),
        description: z.string().min(10),
        locationName: z.string().optional(),
        locationLat: z.string().optional(),
        locationLng: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional(),
        incidentDate: z.date().optional(),
        
        // Item fields
        itemBrand: z.string().optional(),
        itemColor: z.string().optional(),
        itemModel: z.string().optional(),
        
        // Animal fields
        animalType: z.string().optional(),
        animalBreed: z.string().optional(),
        animalName: z.string().optional(),
        
        // Vehicle fields
        vehicleType: z.string().optional(),
        vehiclePlate: z.string().optional(),
        
        // Person fields
        personName: z.string().optional(),
        personNickname: z.string().optional(),
        personAge: z.number().optional(),
        personGender: z.enum(["male", "female"]).optional(),
        personHeight: z.number().optional(),
        personWeight: z.number().optional(),
        personPhysicalFeatures: z.string().optional(),
        personLastWearing: z.string().optional(),
        personRelationship: z.string().optional(),
        personLastKnownInfo: z.string().optional(),
        policeReportNumber: z.string().optional(),
        
        images: z.string().optional(),
        hasReward: z.boolean().optional(),
        rewardAmount: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const reportId = nanoid();
        const report = await db.createReport({
          id: reportId,
          userId: ctx.user.id,
          ...input,
          status: "active",
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        
        return { success: true, reportId };
      }),

    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const report = await db.getReportById(input.id);
        if (!report) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Laporan tidak ditemukan" });
        }
        
        // Increment view count
        await db.incrementReportViews(input.id);
        
        return report;
      }),

    getMyReports: protectedProcedure.query(async ({ ctx }) => {
      return await db.getReportsByUser(ctx.user.id);
    }),

    getByType: publicProcedure
      .input(z.object({
        type: z.enum(["lost_item", "found_item", "lost_person", "find_person"]),
        category: z.enum(["barang", "hewan", "kendaraan", "orang"]).optional(),
        city: z.string().optional(),
        province: z.string().optional(),
        status: z.enum(["active", "resolved", "closed"]).optional(),
        limit: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getReportsByType(input.type, {
          category: input.category,
          city: input.city,
          province: input.province,
          status: input.status,
          limit: input.limit,
        });
      }),

    search: publicProcedure
      .input(z.object({
        query: z.string(),
        type: z.enum(["lost_item", "found_item", "lost_person", "find_person"]).optional(),
        category: z.enum(["barang", "hewan", "kendaraan", "orang"]).optional(),
        city: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return await db.searchReports(input.query, {
          type: input.type,
          category: input.category,
          city: input.city,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["active", "resolved", "closed"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const report = await db.getReportById(input.id);
        if (!report) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        if (report.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        
        const { id, ...updateData } = input;
        await db.updateReport(id, { ...updateData, updatedAt: new Date() });
        
        return { success: true };
      }),
  }),

  // ============================================================================
  // CLAIMS ROUTER
  // ============================================================================
  claims: router({
    create: protectedProcedure
      .input(z.object({
        reportId: z.string(),
        message: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const report = await db.getReportById(input.reportId);
        if (!report) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Laporan tidak ditemukan" });
        }
        
        if (report.userId === ctx.user.id) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Tidak bisa mengklaim laporan sendiri" });
        }
        
        const claimId = nanoid();
        await db.createClaim({
          id: claimId,
          reportId: input.reportId,
          claimantId: ctx.user.id,
          message: input.message,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        
        // Create notification for report owner
        await db.createNotification({
          id: nanoid(),
          userId: report.userId,
          type: "new_claim",
          title: "Klaim Baru",
          message: `Seseorang mengklaim laporan "${report.title}"`,
          reportId: report.id,
          claimId,
          createdAt: new Date(),
        });
        
        return { success: true, claimId };
      }),

    getByReport: publicProcedure
      .input(z.object({ reportId: z.string() }))
      .query(async ({ input }) => {
        return await db.getClaimsByReport(input.reportId);
      }),

    getMyClaims: protectedProcedure.query(async ({ ctx }) => {
      return await db.getClaimsByUser(ctx.user.id);
    }),

    updateStatus: protectedProcedure
      .input(z.object({
        claimId: z.string(),
        status: z.enum(["accepted", "rejected", "completed"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const claim = await db.getClaimById(input.claimId);
        if (!claim) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        
        const report = await db.getReportById(claim.reportId);
        if (!report || report.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        
        await db.updateClaim(input.claimId, {
          status: input.status,
          updatedAt: new Date(),
        });
        
        // Create notification for claimant
        await db.createNotification({
          id: nanoid(),
          userId: claim.claimantId,
          type: input.status === "accepted" ? "claim_accepted" : "claim_rejected",
          title: input.status === "accepted" ? "Klaim Diterima" : "Klaim Ditolak",
          message: `Klaim Anda untuk "${report.title}" telah ${input.status === "accepted" ? "diterima" : "ditolak"}`,
          reportId: report.id,
          claimId: claim.id,
          createdAt: new Date(),
        });
        
        // If accepted, create chat
        if (input.status === "accepted") {
          const existingChat = await db.findExistingChat(report.id, report.userId, claim.claimantId);
          if (!existingChat) {
            const chatId = nanoid();
            await db.createChat({
              id: chatId,
              reportId: report.id,
              claimId: claim.id,
              user1Id: report.userId,
              user2Id: claim.claimantId,
              createdAt: new Date(),
              lastMessageAt: new Date(),
            });
          }
        }
        
        return { success: true };
      }),
  }),

  // ============================================================================
  // CHATS ROUTER
  // ============================================================================
  chats: router({
    getMyChats: protectedProcedure.query(async ({ ctx }) => {
      return await db.getChatsByUser(ctx.user.id);
    }),

    getMessages: protectedProcedure
      .input(z.object({
        chatId: z.string(),
        limit: z.number().optional(),
      }))
      .query(async ({ ctx, input }) => {
        const chat = await db.getChatById(input.chatId);
        if (!chat) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        
        if (chat.user1Id !== ctx.user.id && chat.user2Id !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        
        const messages = await db.getMessagesByChat(input.chatId, input.limit);
        
        // Mark messages as read
        await db.markMessagesAsRead(input.chatId, ctx.user.id);
        
        return messages.reverse(); // Return in chronological order
      }),

    sendMessage: protectedProcedure
      .input(z.object({
        chatId: z.string(),
        content: z.string().min(1),
        messageType: z.enum(["text", "image", "system"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const chat = await db.getChatById(input.chatId);
        if (!chat) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        
        if (chat.user1Id !== ctx.user.id && chat.user2Id !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        
        const messageId = nanoid();
        await db.createMessage({
          id: messageId,
          chatId: input.chatId,
          senderId: ctx.user.id,
          content: input.content,
          messageType: input.messageType || "text",
          createdAt: new Date(),
        });
        
        // Create notification for the other user
        const recipientId = chat.user1Id === ctx.user.id ? chat.user2Id : chat.user1Id;
        await db.createNotification({
          id: nanoid(),
          userId: recipientId,
          type: "new_message",
          title: "Pesan Baru",
          message: input.content.substring(0, 100),
          chatId: chat.id,
          createdAt: new Date(),
        });
        
        return { success: true, messageId };
      }),
  }),

  // ============================================================================
  // COMMENTS ROUTER
  // ============================================================================
  comments: router({
    create: protectedProcedure
      .input(z.object({
        reportId: z.string(),
        content: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const report = await db.getReportById(input.reportId);
        if (!report) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        
        const commentId = nanoid();
        await db.createComment({
          id: commentId,
          reportId: input.reportId,
          userId: ctx.user.id,
          content: input.content,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        
        // Create notification for report owner if not commenting on own report
        if (report.userId !== ctx.user.id) {
          await db.createNotification({
            id: nanoid(),
            userId: report.userId,
            type: "new_comment",
            title: "Komentar Baru",
            message: `${ctx.user.name || "Seseorang"} berkomentar pada laporan "${report.title}"`,
            reportId: report.id,
            createdAt: new Date(),
          });
        }
        
        return { success: true, commentId };
      }),

    getByReport: publicProcedure
      .input(z.object({ reportId: z.string() }))
      .query(async ({ input }) => {
        return await db.getCommentsByReport(input.reportId);
      }),
  }),

  // ============================================================================
  // NOTIFICATIONS ROUTER
  // ============================================================================
  notifications: router({
    getMyNotifications: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return await db.getNotificationsByUser(ctx.user.id, input.limit);
      }),

    getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUnreadNotificationsCount(ctx.user.id);
    }),

    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.string() }))
      .mutation(async ({ input }) => {
        await db.markNotificationAsRead(input.notificationId);
        return { success: true };
      }),

    markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
      await db.markAllNotificationsAsRead(ctx.user.id);
      return { success: true };
    }),
  }),

  // ============================================================================
  // REPORT FLAGS ROUTER (Admin)
  // ============================================================================
  reportFlags: router({
    create: protectedProcedure
      .input(z.object({
        reportId: z.string(),
        reason: z.enum(["fake", "spam", "inappropriate", "duplicate", "resolved", "other"]),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const flagId = nanoid();
        await db.createReportFlag({
          id: flagId,
          reportId: input.reportId,
          reporterId: ctx.user.id,
          reason: input.reason,
          description: input.description,
          status: "pending",
          createdAt: new Date(),
        });
        
        return { success: true, flagId };
      }),
  }),
});

export type AppRouter = typeof appRouter;

