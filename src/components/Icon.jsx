export default function Icon({ name = "search", size = 20 }) {
  const paths = {
    search: "M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
    arrow: "M5 19L19 5M5 5h14v14",
    menu: "M3 6h18M3 12h18M3 18h18",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name] || paths.arrow} />
    </svg>
  );
}
