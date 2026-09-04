"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-client";

// Pages reachable without an account.
const PUBLIC = ["/welcome", "/login"];

/**
 * Hard gate: on the real (server) deployment, everything except the welcome
 * and login pages requires a signed-in account. The static mirror has no
 * backend, so it renders normally.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, ready, hasBackend } = useAuth();
  const path = usePathname();
  const router = useRouter();
  const isPublic = PUBLIC.some((p) => path === p || path.startsWith(`${p}/`));

  useEffect(() => {
    if (hasBackend && ready && !user && !isPublic) router.replace("/welcome");
  }, [hasBackend, ready, user, isPublic, path, router]);

  if (!hasBackend) return <>{children}</>;
  if (!ready) return <div className="gate-load" aria-hidden="true" />;
  if (!user && !isPublic) return <div className="gate-load" aria-hidden="true" />;
  return <>{children}</>;
}
