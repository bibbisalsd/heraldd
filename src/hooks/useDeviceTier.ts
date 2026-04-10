"use client";

import { useState, useEffect } from "react";

type DeviceTier = "high" | "mid" | "low";

interface DeviceInfo {
  tier: DeviceTier;
  isMobile: boolean;
  isLowEnd: boolean;
  canSupportWebGL: boolean;
  prefersReducedMotion: boolean;
}

/**
 * Detects device capability for adaptive rendering.
 * Returns different quality tiers for WebGL effects.
 */
export function useDeviceTier(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    tier: "mid",
    isMobile: false,
    isLowEnd: false,
    canSupportWebGL: true,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    // Check for reduced motion preference
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const prefersReducedMotion = motionQuery.matches;

    // Check if mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;

    // Check hardware concurrency (cores)
    const cores = navigator.hardwareConcurrency || 4;
    const isLowEnd = cores <= 4;

    // Check for WebGL support
    let canSupportWebGL = true;
    try {
      const canvas = document.createElement("canvas");
      canSupportWebGL = !!(
        canvas.getContext("webgl") || canvas.getContext("webgl2")
      );
    } catch {
      canSupportWebGL = false;
    }

    // Determine tier
    let tier: DeviceTier = "mid";
    if (!isMobile && cores >= 8 && canSupportWebGL && !prefersReducedMotion) {
      tier = "high";
    } else if (isMobile || isLowEnd || !canSupportWebGL) {
      tier = "low";
    }

    setDeviceInfo({
      tier,
      isMobile,
      isLowEnd,
      canSupportWebGL,
      prefersReducedMotion,
    });

    // Listen for motion preference changes
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setDeviceInfo((prev) => ({
        ...prev,
        prefersReducedMotion: e.matches,
        tier: e.matches ? "low" : prev.tier,
      }));
    };
    motionQuery.addEventListener("change", handleMotionChange);

    return () => motionQuery.removeEventListener("change", handleMotionChange);
  }, []);

  return deviceInfo;
}

export default useDeviceTier;