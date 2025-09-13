import { generateCareerCounselingResponse } from "@/server/ai";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"; // changed from protectedProcedure

export const aiRouter = createTRPCRouter({
  // Send message to AI and get response
  sendMessage: publicProcedure // changed from protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      content: z.string().min(1).max(2000),
    }))
    .mutation(async ({ ctx, input }) => {
      // First, save the user's message
      const userMessage = await ctx.db.message.create({
        data: {
          chatSessionId: input.sessionId,
          content: input.content,
          role: "user",
        },
      });

      // Get conversation history for context (last 10 messages)
      const conversationHistory = await ctx.db.message.findMany({
        where: {
          chatSessionId: input.sessionId,
        },
        orderBy: {
          createdAt: "asc",
        },
        take: 10,
      });

      // Convert to the format expected by AI service
      const historyForAI = conversationHistory.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

      // Call AI service to get response
      const aiResponseData = await generateCareerCounselingResponse(
        input.content,
        historyForAI
      );

      // Save AI response
      const aiResponse = await ctx.db.message.create({
        data: {
          chatSessionId: input.sessionId,
          content: aiResponseData.content,
          role: "assistant",
          metadata: aiResponseData.metadata,
        },
      });

      // Update the session's lastMessageAt
      await ctx.db.chatSession.update({
        where: {
          id: input.sessionId,
        },
        data: {
          lastMessageAt: new Date(),
        },
      });

      return aiResponse;
    }),

  // Stream message response (placeholder for future streaming implementation)
  streamMessage: publicProcedure // changed from protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      content: z.string().min(1).max(2000),
    }))
    .mutation(async ({ ctx, input }) => {
      // For now, just call the regular sendMessage
      // In the future, this could implement streaming responses
      return await generateCareerCounselingResponse(input.content);
    }),
});