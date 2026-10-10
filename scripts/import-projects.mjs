// Build-time public import. No tokens, dashboards, private repositories, or frontend requests.
import fs from "node:fs/promises";
import { fetchAllRepositories } from "../src/lib/github.js";
const file = new URL("../src/data/projects.json", import.meta.url);
const chosen = JSON.parse(await fs.readFile(file, "utf8"));
const headers = {
  "User-Agent": "SarimIdeaUniverse",
  Accept: "application/vnd.github+json",
};
async function get(url) {
  const r = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}
try {
  const repos = await fetchAllRepositories((page) =>
    get(
      `https://api.github.com/users/SarimSheikh1/repos?per_page=100&page=${page}`,
    ),
  );
  const byId = new Map(repos.map((r) => [r.id, r]));
  for (const p of chosen) {
    const r = byId.get(p.id);
    if (!r) continue;
    p.updatedAt = r.updated_at;
    p.topics = r.topics;
    p.description = r.description || p.description;
    p.candidateUrl = r.homepage || p.candidateUrl;
    p.repositoryUrl = r.html_url;
    try {
      const langs = await get(`${r.url}/languages`);
      p.technologies = Object.keys(langs);
      const readme = await get(`${r.url}/readme`);
      const content = Buffer.from(readme.content || "", "base64").toString(
        "utf8",
      );
      p.readmeExcerpt = content
        .replace(/```[\s\S]*?```/g, "")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[#*_`>]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 900);
      p.readmeUrl = readme.html_url;
      try {
        const pkg = await get(`${r.url}/contents/package.json`);
        const json = JSON.parse(Buffer.from(pkg.content, "base64").toString());
        const deps = { ...json.dependencies, ...json.devDependencies };
        for (const [key, label] of [
          ["react", "React"],
          ["vite", "Vite"],
          ["three", "Three.js"],
          ["tailwindcss", "Tailwind CSS"],
          ["express", "Node.js"],
        ])
          if (deps[key]) p.technologies.push(label);
      } catch {}
    } catch (e) {
      console.warn(`Partial metadata for ${p.title}: ${e.message}`);
    }
    p.technologies = [...new Set(p.technologies)];
  }
  await fs.writeFile(file, JSON.stringify(chosen, null, 2));
  console.log(
    `Read ${repos.length} public repositories; refreshed ${chosen.length} curated projects. Existing previews preserved.`,
  );
} catch (e) {
  console.error(
    `Import failed; existing public data remains intact: ${e.message}`,
  );
  process.exitCode = 1;
}
