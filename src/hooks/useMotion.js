import { useEffect, useState } from "react";
export function useMotion() {
  const [enabled, setEnabled] = useState(() => {
    try {
      return localStorage.getItem("sarim-motion")
        ? localStorage.getItem("sarim-motion") === "on"
        : !matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("sarim-motion", enabled ? "on" : "off");
    } catch {}
  }, [enabled]);
  return [enabled, setEnabled];
}
