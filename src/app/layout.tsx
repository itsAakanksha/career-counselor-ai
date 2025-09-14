import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/react";
import { ClientProviders } from "./client-providers";
import { ThemeProvider } from "@/lib/theme-provider";

export const metadata: Metadata = {
  title: "Career Counselor AI",
  description: "Your personal AI career advisor",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <ThemeProvider defaultTheme="light" storageKey="career-ai-theme">
          <ClientProviders>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
