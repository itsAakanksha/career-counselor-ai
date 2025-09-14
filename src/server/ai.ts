import { env } from "@/env";

interface EuronAPIResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
    finish_reason?: string;
  }>;
  model?: string;
  usage?: {
    total_tokens?: number;
  };
}

export interface AIResponse {
  content: string;
  metadata: {
    model: string;
    tokens: number;
    finishReason: string;
  };
}

export async function generateCareerCounselingResponse(
  userMessage: string,
  conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }> = []
): Promise<AIResponse> {
  try {
    const messages = [
      {
        role: "system" as const,
        content: `You are an experienced career counselor AI. Your role is to provide helpful, professional career advice and guidance. You should:

1. Be empathetic and supportive
2. Ask clarifying questions when needed
3. Provide actionable advice
4. Help with career planning, job search, skill development, and professional growth
5. Be encouraging and positive
6. Keep responses focused on career-related topics
7. Use your knowledge to suggest relevant resources, courses, or next steps

Always maintain a professional, helpful tone and focus on empowering the user to make informed career decisions.`,
      },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      {
        role: "user" as const,
        content: userMessage,
      },
    ];

    const response = await fetch("https://api.euron.one/api/v1/euri/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.EURON_API_TOKEN}`,
      },
      body: JSON.stringify({
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content, // Euron API accepts string content
        })),
        model: "gpt-4.1-nano",
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Euron API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as EuronAPIResponse;

    const aiContent = data.choices?.[0]?.message?.content;
    if (!aiContent) {
      throw new Error("No response from Euron API");
    }

    return {
      content: aiContent,
      metadata: {
        model: data.model ?? "gpt-4.1-nano",
        tokens: data.usage?.total_tokens ?? 0,
        finishReason: data.choices?.[0]?.finish_reason ?? "unknown",
      },
    };
  } catch (error) {
    console.error("Error generating AI response:", error);

    // Fallback response in case of API failure
    return {
      content: "I'm sorry, I'm having trouble connecting right now. As your career counselor, I'd be happy to help you once I'm back online. Please try again in a moment.",
      metadata: {
        model: "fallback",
        tokens: 0,
        finishReason: "error",
      },
    };
  }
}