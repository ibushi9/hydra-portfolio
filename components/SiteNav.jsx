"use client";
import { useEffect, useState } from "react";
import { scrollToSection } from "@/lib/scroll";

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  function goHome() {
    window.location.hash = "";
    window.scrollTo({ top: 0 });
  }

  function navTo(id) {
    setMenuOpen(false);
    setTimeout(() => scrollToSection(id), 600);
  }

  return (
    <>
      <nav id="nav" className={scrolled ? "sc" : ""}>
        <a className="logo" onClick={goHome}>
          Hydra
          <span className="logo-dot" />
        </a>
        <div style={{ display: "flex", alignItems: "center" }}>
          <ul className="nav-links">
            <li>
              <a onClick={() => scrollToSection("video-sec")}>Works</a>
            </li>
            <li>
              <a onClick={() => scrollToSection("services")}>Services</a>
            </li>
            <li>
              <a onClick={() => scrollToSection("contact")} className="nav-cta">
                Contact
              </a>
            </li>
          </ul>
          <button
            className={`hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="メニュー"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <div className={`mob-menu${menuOpen ? " open" : ""}`}>
        <div className="mob-bg" />
        <div className="mob-noise" />
        <div className="mob-grid-line mob-grid-h" />
        <div className="mob-grid-line mob-grid-v" />
        <div className="mob-deco">H</div>
        <ul className="mob-list">
          <li className="mob-item">
            <a onClick={() => navTo("video-sec")}>
              <span className="mob-num">01 —</span>制作実績
            </a>
          </li>
          <li className="mob-item">
            <a onClick={() => navTo("services")}>
              <span className="mob-num">02 —</span>サービス
            </a>
          </li>
          <li className="mob-item">
            <a onClick={() => navTo("contact")}>
              <span className="mob-num">03 —</span>お問い合わせ
            </a>
          </li>
          <li className="mob-item">
            <a
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: ".45em", color: "var(--gneon)", letterSpacing: "2px" }}
            >
              <span className="mob-num" style={{ color: "inherit" }}>
                ✕ —
              </span>
              閉じる
            </a>
          </li>
        </ul>
        <div className="mob-foot">
          <div className="mob-foot-tag">
            Hydra Inc. <br />
            Niigata, Japan / Est. 2024
          </div>
          <div className="mob-foot-gneon">魅せる技術。広める戦略。</div>
        </div>
      </div>
    </>
  );
}
