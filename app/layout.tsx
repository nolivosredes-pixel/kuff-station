import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "KUFF - International DJ & Producer",
  description: "KUFF - International DJ and Producer specializing in Minimal Bass, Tech House, and Indie Dance",
  keywords: ["KUFF", "DJ", "Producer", "Electronic Music", "Tech House", "Minimal Bass", "Indie Dance"],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
