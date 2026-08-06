import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Yuhang Chen",
  description:
    "Personal homepage for Yuhang Chen, featuring research in multimodal models, world models, and AI agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
