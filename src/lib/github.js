export async function fetchAllRepositories(fetchPage) {
  const result = [];
  for (let page = 1; ; page++) {
    const items = await fetchPage(page);
    result.push(...items);
    if (items.length < 100) return result;
  }
}
