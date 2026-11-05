import { site } from "./site";

const key = "17893d9753c7a8f12c86206bdb52a052";

export async function notifyIndexNow() {
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(site.url).hostname,
      key,
      keyLocation: `${site.url}/${key}.txt`,
      urlList: [site.url],
    }),
  });

  if (!response.ok && response.status !== 202) {
    console.error(`IndexNow không nhận URL: HTTP ${response.status}`);
  }
}
