import type { Metadata, Viewport } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import { ProfileProvider } from "@/lib/profile";
import { NavBar } from "@/components/NavBar";

export const metadata: Metadata = {
  title: "SIIT Math Arena",
  description: "Master SIIT math one formula at a time — timed formula quizzes, a formula library, and score tracking for SIIT entrance-exam prep.",
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧮</text></svg>" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ProfileProvider>
          <NavBar />
          <main><div className="wrap">{children}</div></main>
        </ProfileProvider>
      </body>
    </html>
  );
}
