import { expect, test } from "@playwright/test";

test("landing to learning workspace and playback", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Understand algorithms/i })).toBeVisible();
  await page.getByRole("link", { name: /Start Learning/i }).click();
  await expect(page.getByRole("heading", { name: "Bubble Sort" })).toBeVisible();

  await page.getByRole("button", { name: "Play animation" }).click();
  await expect(page.getByText(/Step 2 \/ 63/)).toBeVisible({ timeout: 2500 });

  await page.getByRole("slider", { name: "Animation step" }).fill("10");
  await page.getByRole("tab", { name: "about" }).click();
  await expect(page.getByText("Space Complexity")).toBeVisible();
});

test("42 hub and invalid routes are navigable", async ({ page }) => {
  await page.goto("/42");
  await expect(page.getByRole("heading", { name: /Built for 42 Tirana/i })).toBeVisible();
  await page.getByRole("link", { name: /Memory Blocks/i }).click();
  await expect(page.getByRole("heading", { name: "Memory Blocks (malloc)" })).toBeVisible();

  await page.goto("/does-not-exist");
  await expect(page.getByRole("heading", { name: /Lost in the algorithm/i })).toBeVisible();
});

test("mobile exercise drawer is dismissible and navigates", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "iphone", "Mobile-only drawer behavior");
  await page.goto("/learn/bubble-sort");
  await page.getByRole("button", { name: "Open exercise navigation" }).click();
  await expect(page.getByLabel("Algorithm exercises")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByLabel("Algorithm exercises")).toBeHidden();
  await page.getByRole("button", { name: "Open exercise navigation" }).click();
  await page.getByRole("link", { name: /Binary Search/i }).click();
  await expect(page).toHaveURL(/binary-search/);
  await expect(page.getByRole("heading", { name: "Binary Search" })).toBeVisible();
});

test("learning preferences persist locally", async ({ page }) => {
  await page.goto("/learn/binary-search");
  await expect(page).toHaveTitle(/Binary Search/);
  await page.goto("/learn");
  await expect(page).toHaveURL(/binary-search/);

  const speed = page.getByRole("slider", { name: "Playback speed" });
  await speed.fill("3");
  await page.reload();
  await expect(page.getByRole("slider", { name: "Playback speed" })).toHaveValue("3");
});
