const { test, expect } = require("@playwright/test");

const routes = [
  "/al-folio/",
  "/al-folio/publications/",
  "/al-folio/talks/",
  "/al-folio/projects/",
  "/al-folio/teaching/",
  "/al-folio/cv/",
  "/al-folio/blog/",
  "/al-folio/privacy/",
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
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByText("Page not found")).toHaveCount(0);
  });
}

test("home page preserves the personal introduction", async ({ page }) => {
  await page.goto("/al-folio/", { waitUntil: "networkidle" });
  await expect(page.getByText("Greetings! I am Thang Pham")).toBeVisible();
  await expect(page.getByText("agentic AI systems for scientific discovery").first()).toBeVisible();
});

test("analytics is wired through consent and privacy controls", async ({ page }) => {
  const googleTagRequests = [];
  page.on("request", (request) => {
    if (new URL(request.url()).hostname === "www.googletagmanager.com") {
      googleTagRequests.push(request.url());
    }
  });

  await page.goto("/al-folio/", { waitUntil: "networkidle" });

  const googleTag = page.locator('script[src="https://www.googletagmanager.com/gtag/js?id=G-BGMTPP95EM"]');
  await expect(googleTag).toHaveAttribute("type", "text/plain");
  await expect(googleTag).toHaveAttribute("data-category", "analytics");
  expect(googleTagRequests).toHaveLength(0);
  await expect(page.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "https://tdpham2.github.io/privacy/");

  await page.goto("/al-folio/privacy/", { waitUntil: "networkidle" });
  await expect(page.getByRole("button", { name: "Manage cookie preferences" })).toHaveAttribute("onclick", /CookieConsent\.showPreferences\(\)/);
});

test("CV embeds the full PDF without rendering structured data", async ({ page }) => {
  await page.goto("/al-folio/cv/", { waitUntil: "networkidle" });
  const pdfUrl = "/al-folio/assets/pdf/Thang_Pham_CV.pdf";
  const pdfViewer = page.locator('object[type="application/pdf"]');
  const pdfLink = page.getByRole("link", { name: "Open my full professional CV in a new tab (PDF)" });

  await expect(pdfViewer).toBeVisible();
  await expect(pdfViewer).toHaveAttribute("data", pdfUrl);
  await expect(pdfViewer).toHaveAttribute("title", "Thang Pham curriculum vitae PDF");
  await expect(pdfLink).toHaveAttribute("href", pdfUrl);
  await expect(pdfLink).toHaveAttribute("target", "_blank");

  const pdfResponse = await page.request.get(pdfUrl);
  expect(pdfResponse.ok()).toBeTruthy();
  await expect(page.locator(".cv")).toHaveCount(0);
});

test("projects consolidate repository links", async ({ page }) => {
  await page.goto("/al-folio/projects/", { waitUntil: "networkidle" });
  await expect(page.locator('nav a[href="/al-folio/repositories/"]')).toHaveCount(0);
  await expect(page.getByRole("link", { name: "my GitHub profile" })).toHaveAttribute("href", "https://github.com/tdpham2");

  const leaderboardUrl = "https://huggingface.co/spaces/Autonomous-Scientific-Agents/chemgraph-leaderboard";
  const leaderboardCard = page.locator(`a[href="${leaderboardUrl}"]`, { hasText: "ChemGraph Leaderboard" });
  await expect(leaderboardCard).toBeVisible();
  await expect(page.locator('a[href="https://github.com/Autonomous-Scientific-Agents/chemgraph-leaderboard"]')).toBeVisible();
});

const projectReferences = [
  {
    route: "/al-folio/projects/1_chemgraph/",
    referenceIds: ["pham_chemgraph_2026", "pham2026multiagent"],
  },
  {
    route: "/al-folio/projects/2_pacmof2/",
    referenceIds: ["pham_predicting_2024"],
  },
  {
    route: "/al-folio/projects/4_chemgraph_leaderboard/",
    referenceIds: ["pham_chemgraph_2026"],
  },
  {
    route: "/al-folio/projects/5_mofga/",
    referenceIds: ["pham_implementation_2025"],
  },
];

for (const { route, referenceIds } of projectReferences) {
  test(`${route} renders its related publications`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: "References" })).toBeVisible();
    await expect(page.locator("ol.bibliography > li")).toHaveCount(referenceIds.length);

    for (const referenceId of referenceIds) {
      await expect(page.locator(`#${referenceId}`)).toBeVisible();
    }
  });
}

test("MOFA identifies contributor status without claiming a publication", async ({ page }) => {
  await page.goto("/al-folio/projects/3_mofa/", { waitUntil: "networkidle" });
  await expect(page.locator("li", { hasText: "Role:" })).toContainText("Contributor.");
  await expect(page.getByRole("heading", { name: "References" })).toHaveCount(0);
  await expect(page.locator("ol.bibliography")).toHaveCount(0);
});

test("publication and talk bibliographies render personal entries", async ({ page }) => {
  await page.goto("/al-folio/publications/", { waitUntil: "networkidle" });
  await expect(page.locator("#pham_chemgraph_2026")).toBeVisible();
  await expect(page.locator("#roy2026knowledgeactionoutcomes2025")).toBeVisible();
  await expect(page.locator("#grizzi2026chemgraphxanesagenticframeworkxanes")).toBeVisible();
  await expect(page.locator("#tummalapalli2026overcomingorchestrationbottlenecksexascale")).toBeVisible();
  await expect(page.locator('img[alt="chemgraph_comm_chem.png"]')).toBeVisible();
  await expect(page.locator('img[alt="multi_agent_chemgraph.png"]')).toBeVisible();
  await expect(page.locator('img[alt="side-arm-sterics.png"]')).toBeVisible();
  await expect(page.locator('img[alt="mofga.png"]')).toBeVisible();
  await expect(page.locator('img[alt="coremof.jpg"]')).toBeVisible();
  await expect(page.locator('img[alt="pacmof2.png"]')).toBeVisible();
  await expect(page.locator('img[alt="anionic_mof.png"]')).toBeVisible();
  await expect(page.locator('img[alt="mof_screening_co2_capture.png"]')).toBeVisible();
  await expect(page.locator('img[alt="photocarboxylation.png"]')).toBeVisible();
  await expect(page.locator('img[alt="llm_hackathon.png"]')).toBeVisible();
  await expect(page.locator('img[alt="chemgraph-xanes.png"]')).toBeVisible();
  expect(await page.locator("ol.bibliography > li").count()).toBe(18);

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
