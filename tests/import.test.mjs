import test from "node:test";
import assert from "node:assert/strict";
import { fetchAllRepositories } from "../src/lib/github.js";
test("pagination requests the next page and terminates on a short page", async () => {
  const calls = [];
  const result = await fetchAllRepositories(async (p) => {
    calls.push(p);
    return Array.from({ length: p === 1 ? 100 : 3 }, (_, i) => ({
      id: p * 100 + i,
    }));
  });
  assert.deepEqual(calls, [1, 2]);
  assert.equal(result.length, 103);
});
