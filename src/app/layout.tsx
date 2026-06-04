import type { Metadata } from "next";
import "./globals.css";
import { themeNoFlashScript } from "@/lib/theme";
import Providers from "./components/Providers";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeNoFlashScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
