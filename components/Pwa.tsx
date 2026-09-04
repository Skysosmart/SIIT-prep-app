"use client";

import { useEffect } from "react";

/** Registers the service worker so the site installs and works offline. */
export function Pwa() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
      navigator.serviceWorker.register(`${base}/sw.js`).catch(() => {
        /* offline support is progressive enhancement - ignore failures */
      });
    }
  }, []);
  return null;
}
