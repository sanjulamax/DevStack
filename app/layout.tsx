import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBarPage from "./(normal-web)/navbar/page";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/(normail-web-compo)/footer-compo";

export const metadata: Metadata = {
  title: "DevStack",
  description:
    "DevStack is a global platform for developers to ask questions, share coding knowledge, and connect with a worldwide community of developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <header></header>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <NavBarPage></NavBarPage>
            {children}

            <Footer></Footer>

            <Toaster />
          </ClerkProvider>
        </ThemeProvider>
        <GoogleAnalytics gaId="G-Q524C9FPD8" />
      </body>
    </html>
  );
}
