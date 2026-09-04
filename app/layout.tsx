import type { Metadata, Viewport } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import { ProfileProvider } from "@/lib/profile";
import { NavBar } from "@/components/NavBar";
import { Pwa } from "@/components/Pwa";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "SIIT PREP",
  description: "Master SIIT math one formula at a time - timed formula quizzes, a formula library, and score tracking for SIIT entrance-exam prep.",
  manifest: `${base}/manifest.webmanifest`,
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Math Arena" },
  icons: {
    // Lucide "sigma" icon, teal, as an inline favicon
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2314B8A6' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M18 7V5a1 1 0 0 0-1-1H6.5a.5.5 0 0 0-.4.8l4.5 6a2 2 0 0 1 0 2.4l-4.5 6a.5.5 0 0 0 .4.8H17a1 1 0 0 0 1-1v-2'/></svg>",
    apple: `${base}/icon-192.png`,
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#10172A" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ProfileProvider>
          <NavBar />
          <main><div className="wrap">{children}</div></main>
          <Pwa />
        </ProfileProvider>
      </body>
    </html>
  );
}
