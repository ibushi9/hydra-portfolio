"use client";
import { useEffect, useRef, useState } from "react";

export function useCountUp(target, { duration = 1800, delay = 600 } = {}) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            setTimeout(() => {
              const start = performance.now();
              function step(ts) {
                const p = Math.min((ts - start) / duration, 1);
                const ease = 1 - Math.pow(1 - p, 3);
                setValue(Math.round(ease * target));
                if (p < 1) requestAnimationFrame(step);
              }
              requestAnimationFrame(step);
            }, delay);
          }
        });
      },
      { threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [target, duration, delay]);

  return [value, ref];
}
