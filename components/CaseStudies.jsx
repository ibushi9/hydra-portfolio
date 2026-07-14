"use client";
import { useEffect, useRef } from "react";
import RevealOnScroll from "./RevealOnScroll";

const CASES = [
  {
    num: "01",
    tag: "Case / SNSアカウント運用",
    title: "無名アカウントが2ヶ月で急成長",
    desc: "無名インフルエンサーのアカウントを、投稿設計とショート動画制作で徹底伴走。運用開始からわずか2ヶ月で、大幅なフォロワー増加を実現しました。",
    timeframe: "運用開始から2ヶ月で",
    value: 46000,
    unit: "フォロワー獲得",
  },
  {
    num: "02",
    tag: "Case / 新規アカウント立ち上げ",
    title: "開設1ヶ月・初投稿から20万再生",
    desc: "ゼロから新規開設したアカウントの投稿戦略を設計。1投稿目から20万再生を記録し、開設1ヶ月でフォロワー1,000人を達成しました。",
    timeframe: "開設から1ヶ月で",
    value: 1000,
    unit: "フォロワー達成",
    badge: "1投稿目 20万再生",
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
          <div className="s-num-big">02</div>
        </RevealOnScroll>
      </div>
      <div className="cs-wrap">
        <div className="cs-track">
          {CASES.map((c) => (
            <div className="cs-card" key={c.title}>
              <span className="cs-num" aria-hidden="true">
                {c.num}
              </span>
              <span className="cs-tag">{c.tag}</span>
              <h3 className="cs-title">{c.title}</h3>
              <p className="cs-desc">{c.desc}</p>
              <div className="cs-stat">
                <span className="cs-stat-timeframe">{c.timeframe}</span>
                <div className="cs-stat-value">
                  <CountUpNum target={c.value} />
                  <span className="cs-stat-unit">{c.unit}</span>
                </div>
                {c.badge ? <span className="cs-badge">{c.badge}</span> : null}
              </div>
            </div>
          ))}
        </div>
        <p className="cs-hint">SWIPE TO EXPLORE</p>
      </div>
    </section>
  );
}
