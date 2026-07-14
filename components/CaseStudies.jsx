"use client";
import { useEffect, useRef } from "react";
import RevealOnScroll from "./RevealOnScroll";

const CASES = [
  {
    num: "01",
    tag: "Case / TikTok運用",
    title: "飲食店アカウントの伸長",
    desc: "投稿設計とショート動画制作を伴走し、フォロワー数と来店予約数を同時に押し上げました。",
    before: 1200,
    after: 48000,
    label: "Followers",
  },
  {
    num: "02",
    tag: "Case / Instagram運用",
    title: "アパレルブランドの認知拡大",
    desc: "リール中心の投稿戦略に切り替え、月間リーチを大幅に改善しました。",
    before: 8,
    after: 210,
    label: "月間リーチ(万)",
  },
  {
    num: "03",
    tag: "Case / 動画制作",
    title: "採用ブランディング動画",
    desc: "企業紹介動画の刷新により、応募エントリー数が向上しました。",
    before: 15,
    after: 63,
    label: "応募数",
  },
];

function CountUpNum({ target, className }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const start = performance.now();
          const dur = 1400;
          function step(ts) {
            const p = Math.min((ts - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(ease * target).toLocaleString();
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          observer.disconnect();
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);
  return (
    <span className={className} ref={ref}>
      0
    </span>
  );
}

export default function CaseStudies() {
  return (
    <section id="case-studies" className="sec">
      <div className="sec-divider" />
      <div className="sec-inner">
        <RevealOnScroll as="div" className="s-head">
          <div>
            <div className="sec-lbl">Case Studies</div>
            <h2 className="sec-h">
              導入<em>事例</em>
            </h2>
            <p className="sec-d">実際にご支援したプロジェクトの成果の一部です。</p>
          </div>
          <div className="s-num-big">03</div>
        </RevealOnScroll>
      </div>
      <div className="cs-wrap">
        <div className="cs-track">
          {CASES.map((c) => {
            const multiplier = (c.after / c.before).toFixed(1).replace(/\.0$/, "");
            return (
              <div className="cs-card" key={c.title}>
                <span className="cs-num" aria-hidden="true">
                  {c.num}
                </span>
                <span className="cs-tag">{c.tag}</span>
                <h3 className="cs-title">{c.title}</h3>
                <p className="cs-desc">{c.desc}</p>
                <div className="cs-multiplier">
                  <span className="cs-multiplier-x">×</span>
                  {multiplier}
                  <span className="cs-multiplier-lbl">GROWTH</span>
                </div>
                <div className="cs-ba">
                  <div className="cs-ba-item">
                    <div className="cs-ba-lbl">Before</div>
                    <div className="cs-ba-num">
                      <CountUpNum target={c.before} />
                    </div>
                  </div>
                  <div className="cs-ba-arrow">→</div>
                  <div className="cs-ba-item">
                    <div className="cs-ba-lbl">After — {c.label}</div>
                    <div className="cs-ba-num after">
                      <CountUpNum target={c.after} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="cs-hint">SWIPE TO EXPLORE</p>
      </div>
    </section>
  );
}
