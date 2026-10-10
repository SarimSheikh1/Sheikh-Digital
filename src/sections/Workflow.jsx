import { useRef, useState, useLayoutEffect } from "react";
import { gsap } from "../animations/useAnimation";
const stages = [
  [
    "IDEA",
    "Start with a possibility.",
    "I look for an interesting problem, a useful tool, or an experience worth exploring.",
  ],
  [
    "AI COLLABORATION",
    "Think alongside AI.",
    "I use AI to explore approaches, generate code, and work through problems. I review its suggestions as the idea develops.",
  ],
  [
    "DEVELOPMENT",
    "Make it tangible.",
    "I bring the pieces together, experiment with interfaces, and use project tools to turn the idea into a working experience.",
  ],
  [
    "TESTING",
    "Ask what actually works.",
    "I check interactions, layouts, and errors. Each project has its own testing needs; documented features are not automatically tested features.",
  ],
  [
    "IMPROVEMENT",
    "Keep asking better questions.",
    "Feedback and hands-on exploration help me refine the experience and learn what to try next.",
  ],
  [
    "LAUNCH",
    "Let the idea meet the world.",
    "When a project is ready, I share a public deployment or repository. Some experiments remain works in progress.",
  ],
];
export default function Workflow({ enabled }) {
  const [stage, setStage] = useState(0),
    ref = useRef();
  useLayoutEffect(() => {
    if (!enabled) return;
    const ctx = gsap.context(
      () =>
        gsap.from(".workflow-copy > *", {
          y: 15,
          opacity: 0,
          stagger: 0.08,
          duration: 0.4,
        }),
      ref,
    );
    return () => ctx.revert();
  }, [stage, enabled]);
  return (
    <section id="process" className="workflow" ref={ref} data-reveal>
      <span className="eyebrow">02 / THE IDEA MACHINE</span>
      <h2>
        Human curiosity.
        <br />
        <em>AI possibility.</em>
      </h2>
      <div className="stage-line">
        <svg
          viewBox="0 0 1000 10"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 5H1000" stroke="currentColor" strokeDasharray="6 6" />
        </svg>
        {stages.map(([title], i) => (
          <button
            key={title}
            onClick={() => setStage(i)}
            aria-pressed={stage === i}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {title}
          </button>
        ))}
      </div>
      <div className="workflow-content">
        <span className="giant-stage">
          0{stage + 1}
          <span>↗</span>
        </span>
        <div className="workflow-copy">
          <span className="eyebrow">{stages[stage][0]}</span>
          <h3>{stages[stage][1]}</h3>
          <p>{stages[stage][2]}</p>
          <button
            className="text-button"
            onClick={() => setStage((stage + 1) % 6)}
          >
            Next stage →
          </button>
        </div>
      </div>
    </section>
  );
}
