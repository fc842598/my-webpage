const checks = [
  { name: "robots", url: "https://yuetianai.com/robots.txt" },
  { name: "sitemap", url: "https://yuetianai.com/sitemap.xml" },
  { name: "llms", url: "https://yuetianai.com/llms.txt" },
  { name: "notFound", url: `https://yuetianai.com/__geo_check_missing__${Date.now()}` },
  { name: "home", url: "https://yuetianai.com/" },
  { name: "mingbook", url: "https://yuetianai.com/pages/mingbook-onepage.html" },
  { name: "articles", url: "https://yuetianai.com/articles/" }
];

function pickMeta(html, name) {
  const re = new RegExp(
    `<meta[^>]+${name.includes(":") ? "property" : "name"}=["']${escapeRegExp(name)}["'][^>]+content=["']([^"']+)["']`,
    "i"
  );
  return html.match(re)?.[1] ?? "";
}

function pickLink(html, rel) {
  const re = new RegExp(
    `<link[^>]+rel=["']${escapeRegExp(rel)}["'][^>]+href=["']([^"']+)["']`,
    "i"
  );
  return html.match(re)?.[1] ?? "";
}

function pickTagText(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  return html.match(re)?.[1]?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() ?? "";
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function fetchPage(url) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0 Codex GEO Check"
    }
  });
  const text = await res.text();
  return {
    url,
    status: res.status,
    contentType: res.headers.get("content-type") || "",
    text
  };
}

function summarizeHtml(result) {
  return {
    status: result.status,
    title: pickTagText(result.text, "title"),
    description: pickMeta(result.text, "description"),
    canonical: pickLink(result.text, "canonical"),
    h1: pickTagText(result.text, "h1")
  };
}

async function main() {
  const failures = [];

  for (const check of checks) {
    try {
      const result = await fetchPage(check.url);

      if (check.name === "robots") {
        const ok = result.status === 200 && /Sitemap:/i.test(result.text);
        console.log(`[robots] status=${result.status} sitemap=${/Sitemap:/i.test(result.text)}`);
        if (!ok) failures.push("robots.txt 异常");
        continue;
      }

      if (check.name === "sitemap") {
        const hasXmlMap = /<urlset/i.test(result.text) || /<sitemapindex/i.test(result.text);
        const ok = result.status === 200 && hasXmlMap;
        console.log(`[sitemap] status=${result.status} xmlMap=${hasXmlMap}`);
        if (!ok) failures.push("sitemap.xml 异常");
        continue;
      }

      if (check.name === "llms") {
        const ok = result.status === 200 && /YuetianAI|阅天AI/i.test(result.text);
        console.log(`[llms] status=${result.status} brand=${/YuetianAI|阅天AI/i.test(result.text)}`);
        if (!ok) failures.push("llms.txt 异常");
        continue;
      }

      if (check.name === "notFound") {
        console.log(`[404] status=${result.status} url=${check.url}`);
        if (result.status !== 404) failures.push("随机不存在路径没有返回 404");
        continue;
      }

      const summary = summarizeHtml(result);
      console.log(
        `[${check.name}] status=${summary.status}\n` +
          `  title=${summary.title}\n` +
          `  description=${summary.description}\n` +
          `  canonical=${summary.canonical}\n` +
          `  h1=${summary.h1}`
      );

      if (!summary.title || !summary.description || !summary.canonical || !summary.h1) {
        failures.push(`${check.name} 页面 meta/H1 不完整`);
      }
    } catch (error) {
      console.log(`[${check.name}] error=${error.message}`);
      failures.push(`${check.name} 检查失败`);
    }
  }

  if (failures.length) {
    console.error("\nGEO check failed:");
    for (const item of failures) {
      console.error(`- ${item}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("\nGEO check passed.");
}

main();
