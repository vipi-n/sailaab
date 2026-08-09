import type { Metadata } from "next";
import "./globals.css";

const themeScript = `
  try {
    const stored = localStorage.getItem("rolescout-theme");
    const theme =
      stored === "light" || stored === "dark"
        ? stored
        : matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    document.documentElement.dataset.theme = theme;
  } catch {}
`;

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rolescout.example.com"
).replace(/\/+$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "mixtape.fm — late night drive",
  description:
    "A personal soundtrack for empty roads, city lights, and the long way home.",
  openGraph: {
    title: "mixtape.fm — late night drive",
    description:
      "Songs for empty roads, city lights, and the long way home.",
    images: [`${siteUrl}/og.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "mixtape.fm — late night drive",
    description:
      "Songs for empty roads, city lights, and the long way home.",
    images: [`${siteUrl}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
