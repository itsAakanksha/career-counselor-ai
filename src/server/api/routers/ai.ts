import { generateCareerCounselingResponse } from "@/server/ai";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"; // changed from protectedProcedure

// Helper function to generate session title from first few words of the message
function generateSessionTitle(content: string): string {
  // Clean the content: remove extra whitespace and normalize
  const cleanedContent = content.trim().replace(/\s+/g, ' ');

  // Get the first few words (up to 6 words or 50 characters)
  const words = cleanedContent.split(' ');
  const titleWords = words.slice(0, 6);

  // Join words and limit to 50 characters
  let title = titleWords.join(' ');
  if (title.length > 50) {
    title = title.substring(0, 47) + '...';
  }

  // Ensure minimum length and add fallback
  if (title.length < 3) {
    title = 'New Career Chat';
  }

  return title;
}

export const aiRouter = createTRPCRouter({
  // Send message to AI and get response
  sendMessage: publicProcedure // changed from protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      content: z.string().min(1).max(2000),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if this is the first user message in the session
      const existingUserMessages = await ctx.db.message.count({
        where: {
          chatSessionId: input.sessionId,
          role: "user",
        },
      });

      const isFirstUserMessage = existingUserMessages === 0;

      // First, save the user's message
      await ctx.db.message.create({
        data: {
          chatSessionId: input.sessionId,
          content: input.content,
          role: "user",
        },
      });

      // If this is the first user message, generate and update the session title
      if (isFirstUserMessage) {
        const generatedTitle = generateSessionTitle(input.content);
        await ctx.db.chatSession.update({
          where: {
            id: input.sessionId,
          },
          data: {
            title: generatedTitle,
          },
        });
      }

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
    .mutation(async ({ ctx: _ctx, input }) => {
      // For now, just call the regular sendMessage
      // In the future, this could implement streaming responses
      return await generateCareerCounselingResponse(input.content);
    }),
});