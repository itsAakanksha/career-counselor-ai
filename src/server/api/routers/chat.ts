import { z } from "zod";

import {
  createTRPCRouter,
  // protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const chatRouter = createTRPCRouter({
  // Create a new chat session
  createSession: publicProcedure // changed from protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(100),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.chatSession.create({
        data: {
          title: input.title,
          // userId: ctx.session.user.id, // commented out for testing
        },
      });
    }),

  // Get all chat sessions for the current user
  getSessions: publicProcedure // changed from protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.chatSession.findMany({
        // where: {
        //   userId: ctx.session.user.id, // commented out for testing
        // },
        orderBy: {
          lastMessageAt: "desc",
        },
        include: {
          _count: {
            select: {
              messages: true,
            },
          },
        },
      });
    }),

  // Get a specific chat session with messages
  getSession: publicProcedure // changed from protectedProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.chatSession.findFirst({
        where: {
          id: input.sessionId,
          // userId: ctx.session.user.id, // commented out for testing
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
    }),

  // Get messages for a specific session (paginated)
  getMessages: publicProcedure // changed from protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.message.findMany({
        where: {
          chatSessionId: input.sessionId,
          // chatSession: {
          //   userId: ctx.session.user.id, // commented out for testing
          // },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
        skip: input.offset,
      });
    }),

  // Update chat session title
  updateSessionTitle: publicProcedure // changed from protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      title: z.string().min(1).max(100),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.chatSession.update({
        where: {
          id: input.sessionId,
          // userId: ctx.session.user.id, // commented out for testing
        },
        data: {
          title: input.title,
        },
      });
    }),

  // Delete a chat session
  deleteSession: publicProcedure // changed from protectedProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.chatSession.delete({
        where: {
          id: input.sessionId,
          // userId: ctx.session.user.id, // commented out for testing
        },
      });
    }),
});