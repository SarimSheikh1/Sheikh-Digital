import { useState } from "react";
import { ScrollTrigger } from "../animations/useAnimation";
export default function Preview({ project, large = false }) {
  const [device, setDevice] = useState("desktop");
  const src =
    device === "desktop" ? project.desktopScreenshot : project.mobileScreenshot;
  const image = src ? (
    <img
      src={src}
      srcSet={
        device === "desktop"
          ? `${src.replace("-desktop.webp", "-desktop-small.webp")} 720w, ${src} 1440w`
          : undefined
      }
      sizes={
        large
          ? "(max-width: 767px) 90vw, 1100px"
          : "(max-width: 767px) 90vw, 46vw"
      }
      width={device === "desktop" ? 1440 : 390}
      height={device === "desktop" ? 900 : 844}
      loading="lazy"
      onLoad={() => ScrollTrigger.refresh()}
      alt={`${project.title}: genuine ${device} homepage capture`}
    />
  ) : null;
  return (
    <div className={`preview ${large ? "large" : ""}`}>
      {large && (
        <div className="tabs" role="tablist" aria-label="Preview device">
          {["desktop", "mobile"].map((d) => (
            <button
              key={d}
              role="tab"
              aria-selected={device === d}
              onClick={() => setDevice(d)}
            >
              {d}
            </button>
          ))}
        </div>
      )}
      <div className={`browser ${device}`}>
        <div className="browser-bar">
          <span>● ● ●</span>
          <span>{project.title.toLowerCase()} / interface</span>
          <span>↗</span>
        </div>
        {src ? (
          image
        ) : (
          <div className="no-preview">
            <span className="preview-symbol">
              {project.category === "Travel"
                ? "◈"
                : project.category === "AI experiments"
                  ? "✳"
                  : "⌘"}
            </span>
            <span>PREVIEW NOT AVAILABLE</span>
            <small>Explore the verified repository below</small>
          </div>
        )}
      </div>
      {large && project.screenshotCapturedAt && (
        <small>
          Captured {project.screenshotCapturedAt}. Interfaces may have changed.
        </small>
      )}
    </div>
  );
}
