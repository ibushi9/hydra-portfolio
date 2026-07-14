"use client";
import { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";

function encode(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

export default function ContactSection() {
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "contact", ...form }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="sec">
      <div className="sec-divider" />
      <div className="sec-inner">
        <RevealOnScroll as="div" style={{ textAlign: "center" }}>
          <div className="sec-lbl" style={{ justifyContent: "center" }}>
            Contact
          </div>
          <h2 className="sec-h">お問い合わせ</h2>
          <p className="sec-d" style={{ margin: "0 auto" }}>
            プロジェクトのご相談、お見積もりなどお気軽にどうぞ。
          </p>
        </RevealOnScroll>
        <div className="ct-grid">
          <RevealOnScroll as="div" delayClass="d1">
            <div className="ct-company">Hydra</div>
            <div className="ct-slogan">魅せる技術。広める戦略。</div>
            <div className="ct-line" />
            <div className="ct-item">
              <div className="ct-ic">
                <svg viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <div className="ct-lbl">Address</div>
                <div className="ct-val">
                  〒951-8141
                  <br />
                  新潟県新潟市中央区関新2丁目1-73
                </div>
              </div>
            </div>
            <div className="ct-item">
              <div className="ct-ic">
                <svg viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01-.07.14A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <div>
                <div className="ct-lbl">TEL</div>
                <div className="ct-val">
                  <a href="tel:07085616484">070-8561-6484</a>
                </div>
              </div>
            </div>
            <div className="ct-item">
              <div className="ct-ic">
                <svg viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <div className="ct-lbl">MAIL</div>
                <div className="ct-val">
                  <a href="mailto:hydra.inc.ibu@gmail.com">hydra.inc.ibu@gmail.com</a>
                </div>
              </div>
            </div>
          </RevealOnScroll>
          <RevealOnScroll as="div" delayClass="d2">
            <form className="cf" name="contact" data-netlify="true" netlify-honeypot="bot-field" onSubmit={onSubmit}>
              <input type="hidden" name="form-name" value="contact" />
              <p style={{ display: "none" }}>
                <input name="bot-field" />
              </p>
              <div className="cf-row">
                <div className="cf-fg">
                  <label>Name</label>
                  <input type="text" name="name" placeholder="山田 太郎" required value={form.name} onChange={onChange} />
                </div>
                <div className="cf-fg">
                  <label>Email</label>
                  <input type="email" name="email" placeholder="example@email.com" required value={form.email} onChange={onChange} />
                </div>
              </div>
              <div className="cf-fg">
                <label>Subject</label>
                <input type="text" name="subject" placeholder="お問い合わせの件名" value={form.subject} onChange={onChange} />
              </div>
              <div className="cf-fg">
                <label>Message</label>
                <textarea name="message" placeholder="ご要望・ご質問をお書きください" required value={form.message} onChange={onChange} />
              </div>
              <button type="submit" className="btn-send" disabled={status === "sending"}>
                {status === "sent" ? "SENT ✓" : status === "error" ? "ERROR — RETRY" : status === "sending" ? "SENDING..." : "SEND MESSAGE →"}
              </button>
            </form>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
