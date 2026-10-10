export function filterProjects(
  projects,
  {
    search = "",
    category = "All",
    technology = "All",
    platform = "All",
    featured = false,
  },
) {
  return projects.filter(
    (p) =>
      (!search ||
        [p.title, p.description, ...p.technologies]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())) &&
      (category === "All" || p.category === category) &&
      (technology === "All" || p.technologies.includes(technology)) &&
      (platform === "All" || p.sourcePlatform === platform) &&
      (!featured || p.featured),
  );
}
