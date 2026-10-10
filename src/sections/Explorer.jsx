import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Flip, ScrollTrigger } from "../animations/useAnimation";
import { filterProjects } from "../lib/filter";
import Preview from "../components/Preview";
export default function Explorer({
  projects,
  view,
  setView,
  technology,
  setTechnology,
  enabled,
}) {
  const [search, setSearch] = useState(""),
    [category, setCategory] = useState("All"),
    [platform, setPlatform] = useState("All"),
    [featured, setFeatured] = useState(false);
  const root = useRef(),
    snapshot = useRef(),
    animation = useRef();
  const change = (fn) => {
    animation.current?.kill();
    if (enabled)
      snapshot.current = Flip.getState(
        root.current.querySelectorAll("[data-project]"),
      );
    fn();
  };
  const visible = filterProjects(projects, {
    search,
    category,
    technology,
    platform,
    featured,
  });
  useLayoutEffect(() => {
    if (snapshot.current && enabled) {
      animation.current = Flip.from(snapshot.current, {
        duration: 0.65,
        ease: "power2.inOut",
        absolute: false,
        onComplete: () => ScrollTrigger.refresh(),
      });
      snapshot.current = null;
    }
    return () => animation.current?.kill();
  }, [search, category, technology, platform, featured, view, enabled]);
  return (
    <section id="projects" className="explorer" data-reveal>
      <div className="section-top">
        <span className="eyebrow">01 / EXPLORATION FIELD</span>
        <span className="eyebrow">REAL IDEAS. REAL REPOSITORIES.</span>
      </div>
      <div className="section-heading">
        <h2>
          Ideas in <em>orbit.</em>
        </h2>
        <p>
          A growing collection of experiments.
          <br />
          Pick a project. Follow the idea.
        </p>
      </div>
      <div className="explorer-toolbar">
        <label className="search">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => change(() => setSearch(e.target.value))}
            placeholder="Search the universe…"
            aria-label="Search projects"
          />
        </label>
        <div className="view-switch" aria-label="Project view">
          {["Gallery", "Galaxy", "List"].map((v) => (
            <button
              key={v}
              aria-pressed={view === v}
              onClick={() => change(() => setView(v))}
            >
              {v === "Gallery" ? "▦" : v === "Galaxy" ? "✳" : "☰"} {v}
            </button>
          ))}
        </div>
      </div>
      <div className="filters">
        {[
          [
            "Category",
            category,
            (v) => setCategory(v),
            [...new Set(projects.map((p) => p.category))],
          ],
          [
            "Technology",
            technology,
            (v) => setTechnology(v),
            [...new Set(projects.flatMap((p) => p.technologies))],
          ],
          [
            "Platform",
            platform,
            (v) => setPlatform(v),
            [...new Set(projects.map((p) => p.sourcePlatform))],
          ],
        ].map(([label, val, fn, values]) => (
          <label key={label}>
            {label}
            <select
              value={val}
              onChange={(e) => change(() => fn(e.target.value))}
            >
              <option>All</option>
              {values.sort().map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
        ))}
        <label className="featured-check">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => change(() => setFeatured(e.target.checked))}
          />{" "}
          Featured only
        </label>
        <button
          className="text-button"
          onClick={() =>
            change(() => {
              setSearch("");
              setCategory("All");
              setTechnology("All");
              setPlatform("All");
              setFeatured(false);
            })
          }
        >
          Reset ↺
        </button>
      </div>
      <div className="results" aria-live="polite">
        {visible.length} / {projects.length} PROJECTS{" "}
        <span>
          {view === "Galaxy" ? "SPATIAL INDEX · SELECT ANY ORBIT" : ""}
        </span>
      </div>
      <div ref={root} className={`project-field ${view.toLowerCase()}`}>
        {visible.map((p, i) => (
          <article
            key={p.id}
            data-project
            className={`project-item category-${p.category.replaceAll(" ", "-").toLowerCase()}`}
            style={{ "--order": i % 8 }}
          >
            {view !== "List" && (
              <Link to={`/projects/${p.slug}`} tabIndex={-1} aria-hidden="true">
                {view === "Galaxy" ? (
                  <>
                    <div className="galaxy-mobile-preview">
                      <Preview project={p} />
                    </div>
                    <div className="planet">
                      <span>
                        {p.category === "Travel"
                          ? "◈"
                          : p.category === "Business"
                            ? "◇"
                            : p.category === "Communication"
                              ? "⠿"
                              : p.category === "AI experiments"
                                ? "✳"
                                : "▱"}
                      </span>
                    </div>
                  </>
                ) : (
                  <Preview project={p} />
                )}
              </Link>
            )}
            <div className="project-caption">
              <span className="project-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <span className="eyebrow">
                  {p.category} / {p.sourcePlatform}
                </span>
                <h3>
                  <Link to={`/projects/${p.slug}`}>
                    {p.title} <span>↗</span>
                  </Link>
                </h3>
                <p>{p.technologies.join(" · ") || "Tools not documented"}</p>
              </div>
              {view === "List" && (
                <span className="list-status">
                  {p.liveUrls.length
                    ? "Live project available"
                    : "Repository available"}
                </span>
              )}
            </div>
            <div className="project-use-actions">
              <Link
                className={p.liveUrls.length ? "use-project" : "view-source"}
                to={`/projects/${p.slug}`}
                state={p.liveUrls.length ? { launch: true } : undefined}
              >
                {p.liveUrls.length
                  ? "Use project →"
                  : "View project / live link pending →"}
              </Link>
              {p.liveUrls.length > 0 && (
                <a
                  href={p.liveUrls[0]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${p.title} full website`}
                >
                  Open website ↗
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
      {!visible.length && (
        <div className="empty">
          <h3>No ideas in this orbit.</h3>
          <p>Try another search or reset your filters.</p>
        </div>
      )}
      <p className="source-note">
        Public GitHub inventory. Categories are editorial groupings; repository
        metadata is evidence, not a claim of tested features.
      </p>
    </section>
  );
}
