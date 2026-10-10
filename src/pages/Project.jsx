import { Link, useParams } from "react-router-dom";
import InteractiveProject from "../components/InteractiveProject";
export default function Project({ projects }) {
  const { slug } = useParams();
  const p = projects.find((p) => p.slug === slug);
  if (!p)
    return (
      <main className="detail">
        <h1>Orbit not found.</h1>
        <Link to="/#projects">Back to explorer →</Link>
      </main>
    );
  return (
    <main className="detail">
      <Link className="back" to="/#projects">
        ← BACK TO EXPLORER
      </Link>
      <span className="eyebrow">{p.category} / PROJECT FILE</span>
      <h1>
        {p.title}
        <span>↗</span>
      </h1>
      <div className="detail-meta">
        <span>{p.technologies.join(" / ")}</span>
        <span>{p.verificationStatus}</span>
      </div>
      <InteractiveProject key={p.id} project={p} />
      <div className="detail-grid">
        <div>
          <span className="eyebrow">THE OVERVIEW</span>
          <h2>
            An idea,
            <br />
            made tangible.
          </h2>
        </div>
        <div>
          <p>{p.description}</p>
          <h3>Idea & what was built</h3>
          <p>
            {p.overview ||
              "The public repository is the primary source for this project. Detailed goals and features have not yet been provided by the owner."}
          </p>
          {p.readmeExcerpt && (
            <>
              <h3>From the project README</h3>
              <p>{p.readmeExcerpt}</p>
            </>
          )}
          <h3>AI-assisted creation</h3>
          <p>
            Sarim uses AI as a development partner to explore approaches,
            generate code, and solve problems. A project-specific workflow has
            not been documented here.
          </p>
          <h3>Technologies behind the project</h3>
          <p>
            {p.technologies.join(", ") || "Not documented"} — based on
            repository language and package metadata. No mastery or testing
            claim is implied.
          </p>
          <div className="detail-actions">
            <a
              className="button orange"
              href={p.repositoryUrl}
              target="_blank"
              rel="noreferrer"
            >
              View GitHub repository ↗
            </a>
            {p.liveUrls.map((url) => (
              <a
                className="button"
                key={url}
                href={url}
                target="_blank"
                rel="noreferrer"
              >
                Open live website ↗
              </a>
            ))}
          </div>
          <small>
            Repository updated:{" "}
            {new Date(p.updatedAt).toLocaleDateString("en-GB")}
          </small>
        </div>
      </div>
      <div className="related">
        <span className="eyebrow">CONTINUE EXPLORING</span>
        {projects
          .filter((q) => q.id !== p.id)
          .slice(0, 3)
          .map((q) => (
            <Link key={q.id} to={`/projects/${q.slug}`}>
              {q.title} ↗
            </Link>
          ))}
      </div>
    </main>
  );
}
