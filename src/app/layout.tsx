import type { Metadata } from "next";
import { Sora, Inter_Tight } from "next/font/google";
import "./globals.css";
import { themeNoFlashScript } from "@/lib/theme";
import Providers from "./components/Providers";

const display = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CityHelp — Report. Track. Resolve.",
  description:
    "A civic platform to report city issues, track resolutions, find services, and see your city's health. Built by D L Narayana.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeNoFlashScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
