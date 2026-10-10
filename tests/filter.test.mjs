import test from "node:test";
import assert from "node:assert/strict";
import { filterProjects } from "../src/lib/filter.js";
const ps = [
  {
    title: "Orbit",
    description: "travel",
    category: "Travel",
    technologies: ["React"],
    sourcePlatform: "GitHub",
    featured: true,
  },
  {
    title: "Agent",
    description: "AI",
    category: "AI experiments",
    technologies: ["Python"],
    sourcePlatform: "GitHub",
    featured: false,
  },
];
test("combined filters use intersections", () => {
  assert.equal(
    filterProjects(ps, {
      search: "orbit",
      technology: "React",
      category: "Travel",
      platform: "GitHub",
      featured: true,
    }).length,
    1,
  );
  assert.equal(
    filterProjects(ps, { search: "orbit", technology: "Python" }).length,
    0,
  );
});
test("reset returns complete inventory and search is case insensitive", () => {
  assert.equal(filterProjects(ps, {}).length, 2);
  assert.equal(filterProjects(ps, { search: "AGENT" })[0].title, "Agent");
});
