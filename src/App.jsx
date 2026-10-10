import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { projects, social } from "./data/projects";
import { useMotion } from "./hooks/useMotion";
import { useAnimation } from "./animations/useAnimation";
import Home from "./pages/Home";
import Icon from "./components/Icon";
import Dialog from "./components/Dialog";
import Project from "./pages/Project";
export default function App() {
  const location = useLocation();
  const [enabled, setEnabled] = useMotion(),
    [menu, setMenu] = useState(false),
    [command, setCommand] = useState(false),
    [query, setQuery] = useState(""),
    [view, setView] = useState("Gallery"),
    [technology, setTechnology] = useState("All"),
    [portal, setPortal] = useState(() => {
      try {
        return !localStorage.getItem("sarim-entered");
      } catch {
        return false;
      }
    });
  useAnimation(enabled, location.pathname);
  const enter = () => {
    setPortal(false);
    try {
      localStorage.setItem("sarim-entered", "1");
    } catch {}
  };
  useEffect(() => {
    const key = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommand((v) => !v);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    setMenu(false);
    if (location.hash) {
      const frame = requestAnimationFrame(() =>
        document.getElementById(location.hash.slice(1))?.scrollIntoView(),
      );
      return () => cancelAnimationFrame(frame);
    } else window.scrollTo(0, 0);
  }, [location]);
  const closeCommand = () => {
    setCommand(false);
    setQuery("");
  };
  return (
    <MotionConfig reducedMotion={enabled ? "user" : "always"}>
      <div className="reading-progress" aria-hidden="true" />
      <div className={!enabled ? "motion-off" : ""}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <Link className="brand" to="/">
            SARIM<span>/ THE IDEA UNIVERSE</span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            <Link to="/#projects">Explore work</Link>
            <Link to="/#process">The process</Link>
            <Link to="/#about">The creator</Link>
          </nav>
          <div className="header-tools">
            <button
              aria-label="Open search command palette"
              onClick={() => setCommand(true)}
            >
              <Icon /> <span>CTRL K</span>
            </button>
            <button
              className="motion-toggle"
              aria-pressed={enabled}
              onClick={() => setEnabled((v) => !v)}
            >
              Motion {enabled ? "on" : "off"}
            </button>
            <button
              className="menu-toggle"
              aria-expanded={menu}
              aria-label="Toggle navigation"
              onClick={() => setMenu((v) => !v)}
            >
              ☰
            </button>
          </div>
        </header>
        <AnimatePresence>
          {menu && (
            <motion.nav
              className="mobile-nav"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              aria-label="Mobile navigation"
            >
              {["projects", "process", "about", "contact"].map((s) => (
                <Link key={s} to={`/#${s}`}>
                  {s} ↗
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                enabled={enabled}
                portal={portal}
                enter={enter}
                view={view}
                setView={setView}
                technology={technology}
                setTechnology={setTechnology}
              />
            }
          />
          <Route
            path="/projects/:slug"
            element={
              <div id="main">
                <Project projects={projects} />
              </div>
            }
          />
          <Route
            path="*"
            element={
              <main id="main" className="detail">
                <h1>Lost in space?</h1>
                <Link to="/">Return to the universe →</Link>
              </main>
            }
          />
        </Routes>
        <footer>
          <Link className="brand" to="/">
            SARIM<span>/ THE IDEA UNIVERSE</span>
          </Link>
          <span>© {new Date().getFullYear()} SARIM SHEIKH</span>
          <a href="#main">BACK TO TOP ↑</a>
        </footer>
        {command && (
          <Dialog title="Navigate the universe" onClose={closeCommand}>
            <input
              className="command-input"
              autoFocus
              placeholder="Search projects or sections…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search commands"
            />
            <div className="command-results">
              {projects
                .filter((p) =>
                  p.title.toLowerCase().includes(query.toLowerCase()),
                )
                .map((p) => (
                  <Link
                    key={p.id}
                    to={`/projects/${p.slug}`}
                    onClick={closeCommand}
                  >
                    {p.title}
                    <span>PROJECT ↗</span>
                  </Link>
                ))}
              {["projects", "process", "about", "tools", "contact"]
                .filter((s) => s.includes(query.toLowerCase()))
                .map((s) => (
                  <Link key={s} to={`/#${s}`} onClick={closeCommand}>
                    {s}
                    <span>SECTION ↗</span>
                  </Link>
                ))}
              {["Gallery", "Galaxy", "List"]
                .filter((v) => v.toLowerCase().includes(query.toLowerCase()))
                .map((v) => (
                  <Link
                    key={v}
                    to="/#projects"
                    onClick={() => {
                      setView(v);
                      closeCommand();
                    }}
                  >
                    Switch to {v}
                    <span>VIEW ↗</span>
                  </Link>
                ))}
              {query &&
                !projects.some((p) =>
                  p.title.toLowerCase().includes(query.toLowerCase()),
                ) &&
                ![
                  "projects",
                  "process",
                  "about",
                  "tools",
                  "contact",
                  "gallery",
                  "galaxy",
                  "list",
                ].some((s) => s.includes(query.toLowerCase())) && (
                  <p>No results. Try a project name or section.</p>
                )}
            </div>
            <small>ESC TO CLOSE / TAB TO NAVIGATE</small>
          </Dialog>
        )}
      </div>
    </MotionConfig>
  );
}
