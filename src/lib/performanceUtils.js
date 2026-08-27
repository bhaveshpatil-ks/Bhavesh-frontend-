/**
 * Performance & Low-End Device Detection Utility
 * Detects hardware constraints (CPU cores, RAM, Data Saver, Reduced Motion, Mobile GPU constraints)
 * to intelligently switch between high-fidelity video and optimized static picture.
 */

export function isLowEndDevice() {
  if (typeof window === 'undefined') return false;

  try {
    // 1. Check OS/Browser prefers-reduced-motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return true;
    }

    // 2. Check Network constraints & Data Saver
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      if (connection.saveData === true) return true;
      if (['slow-2g', '2g', '3g'].includes(connection.effectiveType)) return true;
    }

    // 3. Check CPU cores (Hardware Concurrency)
    // Low-end / budget devices typically have <= 4 CPU cores
    if (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4) {
      return true;
    }

    // 4. Check Device Memory (RAM in GB)
    // Low-end devices typically report <= 4GB RAM in Chrome/Edge
    if (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4) {
      return true;
    }

    // 5. Check Mobile screen width combined with touch
    const isMobile = window.innerWidth <= 768 && ('ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 1));
    if (isMobile) {
      // If mobile device has <= 6 cores or unknown/limited specs, use static image for ultra-smooth performance
      if (!navigator.hardwareConcurrency || navigator.hardwareConcurrency <= 6) {
        return true;
      }
    }
  } catch (err) {
    console.warn('Device capability check error:', err);
  }

  return false;
}
