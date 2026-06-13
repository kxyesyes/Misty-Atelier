import { expect, test, type Page } from "@playwright/test";

async function revealPage(page: Page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= height; y += 700) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
}

test("archive filters landscape works", async ({ page }) => {
  await page.goto("/archive");
  await expect(page.getByRole("heading", { name: "Weather-indexed works." })).toBeVisible();
  await expect(page.getByText("Showing 72 of 463")).toBeVisible();
  await page.getByRole("button", { name: "landscape" }).click();
  await expect(page.locator('a[href^="/works/"]')).toHaveCount(4);
});

test("work pages expose adjacent navigation", async ({ page }) => {
  await page.goto("/works/winter-blue-window-room");
  await expect(page.getByText("Previous Work")).toBeVisible();
  await expect(page.getByText("Next Work")).toBeVisible();
  await expect(page.getByText("Route Placement")).toBeVisible();
  await expect(page.getByText("01 / 03")).toBeVisible();
  await expect(page.locator('section:has-text("Route Placement") a[href="/works/morning-reading-room-0"]')).toBeVisible();
});

test("exhibition pages expose curator notes", async ({ page }) => {
  await page.goto("/exhibitions/distant-fables");
  await expect(page.getByText("Curator Note")).toBeVisible();
  await expect(page.getByText("quiet myths")).toBeVisible();
});

test("home page exposes archive route and studio pass", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Misty Atelier" })).toBeVisible();
  await expect(page.getByText("Route I", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open Full Route" })).toHaveAttribute("href", "/route");
  await expect(page.getByText("Studio Pass", { exact: true }).first()).toBeVisible();
});

test("route page exposes the complete curation path", async ({ page }) => {
  await page.goto("/route");
  await expect(page.getByRole("heading", { name: "Curation Route" })).toBeVisible();
  await expect(page.getByText("Route VI", { exact: true })).toBeVisible();
  await expect(page.getByText("Leave by fable")).toBeVisible();
});

test("bulk vertical exhibitions render", async ({ page }) => {
  await page.goto("/exhibitions/porcelain-silence");
  await expect(page.getByRole("heading", { name: "Porcelain Silence" })).toBeVisible();
  await expect(page.locator('a[href^="/works/"]').first()).toBeVisible();

  await page.goto("/exhibitions/holding-room");
  await expect(page.getByRole("heading", { name: "Holding Room" })).toBeVisible();
  await expect(page.locator('a[href^="/works/"]').first()).toBeVisible();
});

test("key pages render visual smoke screenshots", async ({ page }) => {
  for (const path of ["/", "/route", "/exhibitions/blue-rooms", "/works/winter-blue-window-room"]) {
    await page.goto(path);
    await expect(page.locator("main")).toBeVisible();
    await revealPage(page);
    const slug = path === "/" ? "home" : path.replace(/^\//, "").replace(/\//g, "-");
    await page.screenshot({ path: `test-results/visual-smoke-${slug}.png`, fullPage: true });
  }
});
