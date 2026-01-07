"use client";

import { useState, useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const FINGERPRINT_KEY = "device_fingerprint";

export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getFingerprint = async () => {
      // Check localStorage first
      const cached = localStorage.getItem(FINGERPRINT_KEY);
      if (cached) {
        setFingerprint(cached);
        setIsLoading(false);
        return;
      }

      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const visitorId = result.visitorId;

        localStorage.setItem(FINGERPRINT_KEY, visitorId);
        setFingerprint(visitorId);
      } catch (error) {
        console.error("Failed to generate fingerprint:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getFingerprint();
  }, []);

  return { fingerprint, isLoading };
}
