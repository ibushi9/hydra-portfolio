const GH_OWNER = process.env.GH_OWNER || "ibushi9";
const GH_REPO = process.env.GH_REPO || "hydra-portfolio";
const GH_BRANCH = process.env.GH_BRANCH || "main";
const GH_FILE = process.env.GH_FILE || "public/videos.json";

function apiUrl() {
  return `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_FILE}`;
}

function token() {
  const t = process.env.GITHUB_TOKEN;
  if (!t) throw new Error("GITHUB_TOKEN is not set");
  return t;
}

export async function fetchVideosFromGitHub() {
  const res = await fetch(`${apiUrl()}?ref=${GH_BRANCH}`, {
    headers: { Authorization: `Bearer ${token()}`, Accept: "application/vnd.github+json" },
    cache: "no-store",
  });
  if (res.status === 404) return { videos: [], sha: null };
  if (!res.ok) throw new Error(`GitHub fetch failed: ${res.status}`);
  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  const parsed = JSON.parse(content);
  return { videos: Array.isArray(parsed.videos) ? parsed.videos : [], sha: data.sha };
}

export async function pushVideosToGitHub(videos, sha, message) {
  const body = {
    message,
    content: Buffer.from(JSON.stringify({ videos }, null, 2)).toString("base64"),
    branch: GH_BRANCH,
  };
  if (sha) body.sha = sha;
  const res = await fetch(apiUrl(), {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub push failed: ${res.status}`);
  }
  const data = await res.json();
  return data.content.sha;
}
