const { test, expect } = require("@playwright/test");

const routes = [
  "/al-folio/",
  "/al-folio/publications/",
  "/al-folio/talks/",
  "/al-folio/projects/",
  "/al-folio/repositories/",
  "/al-folio/teaching/",
  "/al-folio/cv/",
  "/al-folio/blog/",
];

test.beforeEach(async ({ page }) => {
  await page.route("**/*", async (route) => {
    const url = route.request().url();
    if (url.includes("github-readme-stats.vercel.app") || url.includes("github-profile-trophy.vercel.app")) {
      await route.fulfill({
        status: 200,
        contentType: "image/svg+xml",
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="180"><rect width="400" height="180" fill="#eee"/></svg>',
      });
      return;
    }
    await route.continue();
  });
});

for (const route of routes) {
  test(`${route} renders`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response).not.toBeNull();
    expect(response.ok()).toBeTruthy();
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByText("Page not found")).toHaveCount(0);
  });
}

test("home page preserves the personal introduction", async ({ page }) => {
  await page.goto("/al-folio/", { waitUntil: "networkidle" });
  await expect(page.getByText("Greetings! I am Thang Pham")).toBeVisible();
  await expect(page.getByText("agentic AI systems for scientific discovery").first()).toBeVisible();
});

test("CV renders migrated data and links the PDF", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  await expect(page.getByText("Postdoctoral Researcher").first()).toBeVisible();
  await expect(page.getByText("Argonne National Laboratory").first()).toBeVisible();
  await expect(page.locator('a[href="/al-folio/assets/pdf/CV-ThangPham.pdf"]')).toBeVisible();
});

test("publication and talk bibliographies render personal entries", async ({ page }) => {
  await page.goto("/al-folio/publications/", { waitUntil: "networkidle" });
  await expect(page.locator("#pham_chemgraph_2026")).toBeVisible();
  expect(await page.locator("ol.bibliography > li").count()).toBe(16);

  await page.goto("/al-folio/talks/", { waitUntil: "networkidle" });
  await expect(page.locator("#pham2026isc")).toBeVisible();
  expect(await page.locator("ol.bibliography > li").count()).toBe(12);
});

test("mobile navigation expands and collapses", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile-only behavior");
  await page.goto("/al-folio/", { waitUntil: "networkidle" });

  const toggle = page.locator(".navbar-toggler").first();
  const nav = page.locator(".navbar-collapse").first();
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(nav).toHaveClass(/show/);
  await toggle.click();
  await expect(nav).not.toHaveClass(/show/);
});
