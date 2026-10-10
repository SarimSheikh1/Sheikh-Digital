import Visual from "../components/Visual";
import Explorer from "../sections/Explorer";
import Workflow from "../sections/Workflow";
import { projects, social } from "../data/projects";
export default function Home({
  enabled,
  portal,
  enter,
  view,
  setView,
  technology,
  setTechnology,
}) {
  return (
    <main id="main">
      <section className="hero">
        <div className="hero-meta">
          <span className="eyebrow">
            <i className="status-dot" /> AI-POWERED DIGITAL CREATOR & BUILDER
          </span>
          <span className="eyebrow">
            BASED IN PAKISTAN / OPEN TO POSSIBILITIES
          </span>
        </div>
        {portal && (
          <div className="portal-strip">
            <span>
              EVERYTHING STARTS WITH AN IDEA. <b>SARIM SHEIKH</b>
            </span>
            <div>
              <button onClick={enter}>ENTER MY UNIVERSE →</button>
              <button onClick={enter}>Skip</button>
              <a href="#projects" onClick={enter}>
                Projects ↗
              </a>
            </div>
          </div>
        )}
        <h1 className="hero-type">
          <div className="hero-line">
            I HAVE <span className="outline">IDEAS.</span>
          </div>
          <div className="hero-line">AI HELPS ME</div>
          <div className="hero-line orange-text">
            BUILD THEM<span className="period">.</span>
          </div>
        </h1>
        <Visual enabled={enabled} />
        <div className="hero-bottom">
          <p>
            Hi, I'm <b>Sarim Sheikh</b> — an AI-Powered Digital Creator who
            transforms ideas into websites, applications, and interactive
            digital experiences.
          </p>
          <a className="button orange magnetic" href="#projects">
            <span className="magnetic-label">
              Explore my universe <span>↗</span>
            </span>
          </a>
          <span className="scroll-cue">
            SCROLL TO DISCOVER <span>↓</span>
          </span>
        </div>
        <div className="hero-coordinate">
          IDEA → EXPERIMENT → REALITY <span>EST. WITH CURIOSITY</span>
        </div>
      </section>
      <div className="ticker" aria-hidden="true">
        <span>
          IDEAS WITHOUT LIMITS ✳ BUILT WITH AI ✳ MADE BY SARIM ✳ IDEAS WITHOUT
          LIMITS ✳ BUILT WITH AI ✳
        </span>
      </div>
      <Explorer
        projects={projects}
        view={view}
        setView={setView}
        technology={technology}
        setTechnology={setTechnology}
        enabled={enabled}
      />
      <Workflow enabled={enabled} />
      <section id="about" className="about" data-reveal>
        <div className="about-art" aria-hidden="true">
          S<span>✳</span>
          <small>THE HUMAN BEHIND THE IDEAS</small>
        </div>
        <div>
          <span className="eyebrow">03 / THE CREATOR</span>
          <h2>
            Curiosity is
            <br />
            my <em>starting point.</em>
          </h2>
          <p>
            I use AI as my development partner to explore ideas, generate code,
            solve problems, and build digital projects. Every project is an
            opportunity to experiment, learn, and create something new.
          </p>
          <p className="signature">
            Sarim Sheikh <span>↗</span>
          </p>
        </div>
      </section>
      <section id="tools" className="dna" data-reveal>
        <span className="eyebrow">04 / DIGITAL DNA</span>
        <h2>
          Technologies behind
          <br />
          <em>my projects.</em>
        </h2>
        <div className="tool-constellation">
          {[...new Set(projects.flatMap((p) => p.technologies))]
            .sort()
            .map((t, i) => (
              <a
                key={t}
                href="#projects"
                style={{ "--i": i }}
                onClick={() => setTechnology(t)}
              >
                <span>0{i + 1} /</span>
                {t}
                <small>
                  {projects.filter((p) => p.technologies.includes(t)).length}{" "}
                  project relationships ↗
                </small>
              </a>
            ))}
        </div>
        <p>
          Tools I use to bring ideas to life. Select one to explore the
          connected work.
        </p>
      </section>
      <section id="contact" className="contact" data-reveal>
        <span className="eyebrow">05 / THE NEXT IDEA</span>
        <h2>
          What if
          <br />
          <em>we built it?</em>
          <span>↗</span>
        </h2>
        <div>
          <p>
            I turn ideas into reality using AI.
            <br />
            Follow the experiments. Explore the source.
          </p>
          <div className="socials">
            {Object.entries(social)
              .filter(([, url]) => url)
              .map(([label, url]) => (
                <a
                  key={label}
                  href={label === "email" ? `mailto:${url}` : url}
                  target={label === "email" ? undefined : "_blank"}
                  rel="noreferrer"
                >
                  {label} ↗
                </a>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
