import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Yuhang Chen",
  description:
    "Yuhang Chen researches world models, multimodal intelligence, and embodied AI. Interested in Fall 2027 PhD opportunities in the United States, Singapore, and Hong Kong.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{document.documentElement.dataset.theme=localStorage.getItem("theme")==="dark"?"dark":"light"}catch{}` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
