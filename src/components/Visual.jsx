import { Component, lazy, Suspense, useEffect, useState, useRef } from "react";
const Artifact = lazy(() => import("./Artifact"));
class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function Visual({ enabled }) {
  const [active, setActive] = useState(false),
    ref = useRef();
  useEffect(() => {
    if (!enabled || innerWidth < 768) return;
    let supported = false,
      visible = true;
    try {
      supported = !!document.createElement("canvas").getContext("webgl2");
    } catch {}
    const onVisibility = () =>
      setActive(supported && visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      onVisibility();
    });
    observer.observe(ref.current);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);
  return (
    <div ref={ref} className="artifact" aria-hidden="true">
      <div className="silver-knot">
        <i />
        <i />
        <i />
      </div>
      {enabled && active && (
        <Boundary>
          <Suspense fallback={null}>
            <Artifact />
          </Suspense>
        </Boundary>
      )}
      <span className="orbit-label">ARTIFACT_001 / AN IDEA TAKING SHAPE</span>
    </div>
  );
}
