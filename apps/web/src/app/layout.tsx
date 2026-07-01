import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/auth-context";

export const metadata: Metadata = {
  title: "BuyWise — AI Purchase Intelligence",
  description: "Stop regretting purchases. AI-powered trust scoring, sentiment analysis, and decision intelligence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
