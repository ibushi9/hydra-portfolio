import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/adminSession";
import { fetchVideosFromGitHub, pushVideosToGitHub } from "@/lib/github";

function extractTkId(url) {
  const m = url.match(/\/video\/(\d+)/);
  return m ? m[1] : null;
}

export async function GET(request) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { videos } = await fetchVideosFromGitHub();
    return NextResponse.json({ videos });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}

export async function POST(request) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { url, title } = await request.json().catch(() => ({}));
  if (!url || !extractTkId(url)) {
    return NextResponse.json({ error: "有効なTikTok動画URLではありません" }, { status: 400 });
  }
  try {
    const { videos, sha } = await fetchVideosFromGitHub();
    const next = [{ url, title: title || "TikTok動画" }, ...videos];
    await pushVideosToGitHub(next, sha, `Add: ${title || url}`);
    return NextResponse.json({ videos: next });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}

export async function DELETE(request) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { index } = await request.json().catch(() => ({}));
  if (typeof index !== "number") {
    return NextResponse.json({ error: "index is required" }, { status: 400 });
  }
  try {
    const { videos, sha } = await fetchVideosFromGitHub();
    if (index < 0 || index >= videos.length) {
      return NextResponse.json({ error: "Invalid index" }, { status: 400 });
    }
    const removed = videos[index];
    const next = videos.filter((_, i) => i !== index);
    await pushVideosToGitHub(next, sha, `Remove: ${removed.title || removed.url}`);
    return NextResponse.json({ videos: next });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
