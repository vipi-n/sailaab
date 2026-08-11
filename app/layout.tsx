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
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteThumbnail = `${basePath}/sailaab-storm-painting-v3.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Sailaab",
  description: "Sailaab",
  icons: {
    icon: siteThumbnail,
    apple: siteThumbnail,
  },
  openGraph: {
    title: "Sailaab",
    description: "Sailaab",
    images: [siteThumbnail],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sailaab",
    description: "Sailaab",
    images: [siteThumbnail],
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
