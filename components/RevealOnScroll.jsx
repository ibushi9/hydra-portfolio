"use client";
import { useEffect, useRef } from "react";

export default function RevealOnScroll({ as: Tag = "div", className = "", delayClass = "", children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            entry.target.querySelectorAll("[data-target]").forEach((n) =>
              n.dispatchEvent(new Event("hydra-animate-count"))
            );
          }
        });
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`rv ${delayClass} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
