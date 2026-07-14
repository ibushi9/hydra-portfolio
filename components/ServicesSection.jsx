"use client";
import { useEffect, useRef } from "react";
import { scrollToSection } from "@/lib/scroll";
import RevealOnScroll from "./RevealOnScroll";

const SERVICES = [
  {
    num: "01",
    idx: "/ 01",
    title: "動画制作",
    desc: "SNS向け短尺ムービーから企業PRビデオまで、視聴者の心を掴む映像コンテンツを高品質に制作します。",
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="1" />
        <polygon points="10,8 16,11 10,14" />
      </svg>
    ),
  },
  {
    num: "02",
    idx: "/ 02",
    title: "SNS運用マーケティング",
    desc: "TikTok・Instagram・YouTube等のプラットフォームで効果的なブランドコミュニケーションを展開します。",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
  },
  {
    num: "03",
    idx: "/ 03",
    title: "AI活用コンテンツ",
    desc: "AIによる動画自動編集・SNSリサーチツールなど、制作を加速するAIプロダクトの開発・提供を行います。",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
];

function ServiceCard({ s, i, cardsRef }) {
  const innerRef = useRef(null);

  function onMouseMove(e) {
    const el = innerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${px * 18}deg) rotateX(${-py * 18}deg) translateZ(10px)`;
  }
  function onMouseLeave() {
    if (innerRef.current) innerRef.current.style.transform = "";
  }

  return (
    <div className="s-card" ref={(el) => (cardsRef.current[i] = el)} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div className="s-card-inner" ref={innerRef}>
        <span className="s-card-num" aria-hidden="true">
          {s.num}
        </span>
        <span className="s-idx">{s.idx}</span>
        <div className="s-ico">{s.icon}</div>
        <h3>{s.title}</h3>
        <p>{s.desc}</p>
        <a className="s-more" onClick={() => scrollToSection("contact")}>
          詳しく見る →
        </a>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const cardsRef = useRef([]);

  useEffect(() => {
    let ctx;
    let cancelled = false;
    import("gsap").then(({ default: gsap }) =>
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          cardsRef.current.forEach((card, i) => {
            if (!card) return;
            gsap.fromTo(
              card,
              { rotateY: i % 2 === 0 ? -110 : 110, rotateZ: i % 2 === 0 ? -4 : 4, opacity: 0, scale: 0.8, transformPerspective: 1400 },
              {
                rotateY: 0,
                rotateZ: 0,
                opacity: 1,
                scale: 1,
                duration: 1.1,
                ease: "power4.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 90%",
                },
              }
            );
          });
        });
      })
    );
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section id="services" className="sec">
      <div className="sec-divider" />
      <div className="sec-inner">
        <RevealOnScroll as="div" className="s-head">
          <div>
            <div className="sec-lbl">Services</div>
            <h2 className="sec-h">
              私たちの<em>サービス</em>
            </h2>
            <p className="sec-d">お客様のビジョンを実現するために、最適なソリューションをご提供します。</p>
          </div>
          <div className="s-num-big">02</div>
        </RevealOnScroll>
        <div className="s-grid">
          {SERVICES.map((s, i) => (
            <ServiceCard s={s} i={i} cardsRef={cardsRef} key={s.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
