import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
