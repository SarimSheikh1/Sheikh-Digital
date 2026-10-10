import { useEffect, useRef } from "react";
import { motion } from "motion/react";
export default function Dialog({ title, onClose, children }) {
  const ref = useRef();
  useEffect(() => {
    const prior = document.activeElement;
    const el = ref.current;
    el.showModal();
    const key = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    el.addEventListener("keydown", key);
    return () => {
      el.removeEventListener("keydown", key);
      el.close();
      prior?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="dialog-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="dialog-inner"
      >
        <header>
          <h2 id="dialog-title">{title}</h2>
          <button onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </header>
        {children}
      </motion.div>
    </dialog>
  );
}
