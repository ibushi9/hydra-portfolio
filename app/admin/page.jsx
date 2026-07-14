"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

function extractTkId(url) {
  const m = url.match(/\/video\/(\d+)/);
  return m ? m[1] : null;
}

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [videos, setVideos] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [tkUrl, setTkUrl] = useState("");
  const [tkTitle, setTkTitle] = useState("");
  const [formMsg, setFormMsg] = useState({ text: "", type: "" });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => {
        setAuthed(!!d.authenticated);
        if (d.authenticated) loadVideos();
      })
      .finally(() => setChecking(false));
  }, []);

  async function loadVideos() {
    setLoadingList(true);
    try {
      const res = await fetch("/api/admin/videos");
      const data = await res.json();
      setVideos(Array.isArray(data.videos) ? data.videos : []);
    } finally {
      setLoadingList(false);
    }
  }

  async function login(e) {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setLoginError(d.error || "ログインに失敗しました");
        return;
      }
      setAuthed(true);
      setPassword("");
      loadVideos();
    } catch {
      setLoginError("接続エラーが発生しました");
    } finally {
      setLoggingIn(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setVideos([]);
  }

  async function addVideo() {
    const url = tkUrl.trim();
    if (!url) {
      setFormMsg({ text: "URLを入力してください", type: "err" });
      return;
    }
    if (!extractTkId(url)) {
      setFormMsg({ text: "有効なTikTok動画URLではありません", type: "err" });
      return;
    }
    setAdding(true);
    setFormMsg({ text: "追加中...", type: "info" });
    try {
      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, title: tkTitle.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "追加に失敗しました");
      setVideos(data.videos);
      setTkUrl("");
      setTkTitle("");
      setFormMsg({ text: "✓ 公開完了。約1分で反映されます", type: "ok" });
      setTimeout(() => setFormMsg({ text: "", type: "" }), 5000);
    } catch (e) {
      setFormMsg({ text: "Error: " + e.message, type: "err" });
    } finally {
      setAdding(false);
    }
  }

  async function delVideo(index) {
    if (!confirm("Delete this video?")) return;
    setFormMsg({ text: "削除中...", type: "info" });
    try {
      const res = await fetch("/api/admin/videos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "削除に失敗しました");
      setVideos(data.videos);
      setFormMsg({ text: "✓ 削除しました", type: "ok" });
      setTimeout(() => setFormMsg({ text: "", type: "" }), 4000);
    } catch (e) {
      setFormMsg({ text: "Error: " + e.message, type: "err" });
    }
  }

  if (checking) return null;

  return (
    <section id="admin">
      <div className="ad-wrap">
        {!authed ? (
          <div className="ad-login">
            <div className="ad-login-head">
              <div className="ad-login-ic">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="1" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <h2>Admin</h2>
              <p>パスワードを入力してください</p>
            </div>
            <form onSubmit={login}>
              <div className="ad-field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="パスワード"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" disabled={loggingIn}>
                {loggingIn ? "接続中..." : "LOGIN →"}
              </button>
              <div className="ad-login-err">{loginError}</div>
            </form>
          </div>
        ) : (
          <div>
            <div className="ad-head">
              <div>
                <Link href="/" className="btn-back">
                  ← SITE
                </Link>
                <h1 className="ad-title" style={{ marginTop: "16px" }}>
                  動画<em>管理</em>
                </h1>
                <p className="ad-sub">追加・削除した内容は約1分でサイト全体に反映されます</p>
              </div>
              <button className="btn-back" onClick={logout} style={{ borderColor: "#ff4466", color: "#ff4466" }}>
                LOGOUT
              </button>
            </div>
            <div className="ad-info">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <div>動画リストは GitHub に保存され、Netlify が自動でサイトを更新します。追加後、訪問者の画面に反映されるまで約30秒〜1分かかります。</div>
            </div>
            <div className="ad-form">
              <h3>TikTok 動画を追加</h3>
              <p className="ad-form-sub">TikTok 動画ページの URL(例: https://www.tiktok.com/@username/video/1234567890)を貼り付けてください。</p>
              <div className="ad-form-row">
                <input
                  type="url"
                  placeholder="https://www.tiktok.com/@username/video/..."
                  value={tkUrl}
                  onChange={(e) => setTkUrl(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="キャプション(編集可)"
                  style={{ maxWidth: "280px" }}
                  value={tkTitle}
                  onChange={(e) => setTkTitle(e.target.value)}
                />
                <button className="ad-add-btn" onClick={addVideo} disabled={adding}>
                  {adding ? <span className="ad-spin" /> : "+ 追加して公開"}
                </button>
              </div>
              <div className={`ad-form-msg ${formMsg.type}`}>{formMsg.text}</div>
            </div>
            <div className="ad-list">
              <div className="ad-list-head">
                <h3>
                  公開中の動画 <span className="ad-list-count">{videos.length}</span>
                </h3>
              </div>
              {loadingList ? (
                <div className="c-loading">
                  <div className="c-loading-spin" />
                </div>
              ) : !videos.length ? (
                <div className="ad-empty">
                  <div className="ad-empty-ic">🎵</div>
                  <p>NO VIDEOS YET</p>
                </div>
              ) : (
                <div className="ad-items">
                  {videos.map((v, i) => (
                    <div className="ad-item" key={i}>
                      <div className="ad-thumb">
                        🎵
                        <div className="ad-tk-badge">TIKTOK</div>
                      </div>
                      <button className="ad-item-del" onClick={() => delVideo(i)}>
                        <svg viewBox="0 0 24 24">
                          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        </svg>
                      </button>
                      <div className="ad-item-info">
                        <div className="ad-item-name">{v.title || `Video ${i + 1}`}</div>
                        <div className="ad-item-id">ID: {extractTkId(v.url) || "invalid"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
