import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Preview from "./Preview";

export default function InteractiveProject({ project }) {
  const location = useLocation();
  const [mode, setMode] = useState("interactive");
  const [started, setStarted] = useState(Boolean(location.state?.launch));
  const [device, setDevice] = useState("desktop");
  const [session, setSession] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const url = project.liveUrls[0];
  useEffect(() => {
    if (!started || mode !== "interactive") return;
    setWaiting(true);
    const timer = setTimeout(() => setWaiting(false), 10000);
    return () => clearTimeout(timer);
  }, [started, mode, session, project.id]);

  return (
    <section
      className="interactive-project"
      aria-label={`${project.title} working project`}
    >
      <div className="interactive-toolbar">
        <div className="tabs" aria-label="Project display">
          <button
            aria-pressed={mode === "interactive"}
            onClick={() => setMode("interactive")}
          >
            Use project
          </button>
          <button
            aria-pressed={mode === "screenshot"}
            onClick={() => setMode("screenshot")}
          >
            Interface capture
          </button>
        </div>
        {url && (
          <a
            className="button orange"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            Open full website ↗
          </a>
        )}
      </div>
      {mode === "screenshot" ? (
        <Preview project={project} large />
      ) : url ? (
        <>
          <div className="interactive-device-controls">
            <span className="eyebrow">LIVE WEBSITE / INTERACTIVE SESSION</span>
            <div>
              {["desktop", "mobile"].map((d) => (
                <button
                  key={d}
                  aria-pressed={device === d}
                  onClick={() => setDevice(d)}
                >
                  {d}
                </button>
              ))}
              {started && (
                <button onClick={() => setSession((s) => s + 1)}>
                  Reload ↻
                </button>
              )}
              {started && (
                <button onClick={() => setStarted(false)}>Stop ×</button>
              )}
            </div>
          </div>
          <div className={`live-browser ${device}`}>
            <div className="browser-bar">
              <span>● ● ●</span>
              <span>{new URL(url).hostname}</span>
              <span>LIVE ↗</span>
            </div>
            {started ? (
              <iframe
                key={`${project.id}-${session}`}
                src={url}
                title={`Use ${project.title} live website`}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
                allow="fullscreen"
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => setWaiting(false)}
              />
            ) : (
              <div className="live-start">
                <span className="live-orbit" aria-hidden="true">
                  ↗
                </span>
                <h2>Try the actual project.</h2>
                <p>
                  Explore the website, use its controls, and see the idea in
                  action.
                </p>
                <button
                  className="button orange"
                  onClick={() => setStarted(true)}
                >
                  Start project →
                </button>
                <small>
                  The external website loads only when you start it.
                </small>
              </div>
            )}
          </div>
          {started && (
            <div className="embed-help" role="status">
              <span>
                {waiting ? "Requesting the website…" : "Website requested."} If
                it stays blank or is blocked, open it in its own tab.
              </span>
              <a href={url} target="_blank" rel="noreferrer">
                Blank or blocked? Open website ↗
              </a>
            </div>
          )}
          <small className="live-note">
            Explore the actual website. Use Desktop or Mobile to change the
            viewing width, or open the full website in its own tab.
          </small>
        </>
      ) : (
        <div className="pending-live">
          <span className="eyebrow">PUBLIC DEPLOYMENT PENDING</span>
          <h2>This idea needs a live link.</h2>
          <p>
            The owner is preparing a public deployment. The genuine source is
            available now.
          </p>
          <a
            className="button"
            href={project.repositoryUrl}
            target="_blank"
            rel="noreferrer"
          >
            Explore source on GitHub ↗
          </a>
          <Link className="text-button" to="/#projects">
            Choose another project →
          </Link>
        </div>
      )}
    </section>
  );
}
