import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import Lenis from "lenis";
gsap.registerPlugin(ScrollTrigger, Flip);
export { gsap, ScrollTrigger, Flip };
export function useAnimation(enabled, path) {
  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({ autoRaf: false, anchors: true });
    const tick = (t) => lenis.raf(t * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    const listeners = [];
    const ctx = gsap.context(() => {
      gsap.from(".hero-line", {
        y: 90,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
      });
      gsap.to(".reading-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
      gsap.utils.toArray("[data-reveal]").forEach((el) =>
        gsap.from(el, {
          y: 35,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        }),
      );
      if (matchMedia("(pointer:fine)").matches)
        document.querySelectorAll(".magnetic").forEach((el) => {
          const target = el.querySelector(".magnetic-label");
          if (!target) return;
          const move = (e) => {
            const rect = el.getBoundingClientRect();
            gsap.to(target, {
              x: (e.clientX - rect.left - rect.width / 2) * 0.1,
              y: (e.clientY - rect.top - rect.height / 2) * 0.12,
              duration: 0.3,
            });
          };
          const leave = () => gsap.to(target, { x: 0, y: 0, duration: 0.4 });
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          listeners.push(() => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
            gsap.set(target, { clearProps: "transform" });
          });
        });
    });
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      listeners.forEach((fn) => fn());
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.removeEventListener("load", refresh);
    };
  }, [enabled, path]);
}
