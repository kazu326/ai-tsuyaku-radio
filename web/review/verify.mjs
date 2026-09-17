import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import matter from "gray-matter";

// Browser-only review tools are supplied externally, not shipped with the app.
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const { marked } = require("marked");
const directory = path.dirname(fileURLToPath(import.meta.url));
const origin = process.env.RADIO_REVIEW_URL || "http://127.0.0.1:3000";
const source = await readFile(path.resolve(directory, "../../episodes/ep003-japan-semiconductor/article.md"), "utf8");
const { data, content } = matter(source);
const expectedHtml = marked.parse(content.replace(/^\s*# [^\r\n]+\r?\n/, "").trim());
const articlePath = "/episodes/ep003-japan-semiconductor";
const failures = [];
const results = [];
const browser = await chromium.launch({ channel: "chrome", headless: true });

try {
  await mkdir(directory, { recursive: true });
  for (const width of [375, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.on("pageerror", (error) => failures.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") failures.push(message.text()); });
    page.on("response", (response) => { if (response.url().startsWith(origin) && response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });

    for (const [name, route] of [["home", "/"], ["article", articlePath]]) {
      const response = await page.goto(origin + route, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200);
      await page.evaluate(() => document.fonts.ready);
      await page.locator("footer").scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);
      await page.locator("img").evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
      await page.evaluate(() => window.scrollTo(0, 0));
      const metrics = await page.evaluate(() => ({
        width: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        h1: document.querySelectorAll("h1").length,
        robots: document.querySelector('meta[name="robots"]')?.content,
        brokenImages: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).length,
        brokenImageSources: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
        missingAlt: [...document.images].filter((image) => !image.hasAttribute("alt")).length,
        errorOverlays: document.querySelectorAll("[data-nextjs-dialog]").length,
      }));
      assert.ok(metrics.scrollWidth <= width, `${name} at ${width}px overflows`);
      assert.equal(metrics.h1, 1);
      assert.match(metrics.robots, /noindex/);
      assert.equal(metrics.brokenImages, 0, `Broken images: ${metrics.brokenImageSources.join(", ")}`);
      assert.equal(metrics.missingAlt, 0);
      assert.equal(metrics.errorOverlays, 0);

      if (name === "home") {
        assert.equal(await page.locator(".episode-card").count(), 1);
        assert.equal(await page.locator(".content-item").count(), 3);
        assert.equal(await page.locator(".news-list > li").count(), 5);
        assert.equal(await page.locator(".desktop-nav a").count(), 4);
        assert.match(await page.locator(".episode-image-link img").getAttribute("src"), /episode-003\.png/);
        assert.equal(await page.locator(".image-label").textContent(), "EPISODE.003");
        const hero = await page.locator(".hero").evaluate((element) => ({
          height: element.getBoundingClientRect().height,
          image: document.querySelector(".hero-image")?.currentSrc,
        }));
        assert.equal(hero.height, width <= 700 ? 680 : width <= 1000 ? 560 : 600);
        assert.match(hero.image, width <= 700 ? /hero-mobile\.png/ : /hero-20260915\.png/);
        await page.keyboard.press("Tab");
        assert.equal(await page.locator(":focus").textContent(), "本文へスキップ");
        const focus = await page.locator(":focus").evaluate((element) => ({ outline: getComputedStyle(element).outlineWidth, top: element.getBoundingClientRect().top }));
        assert.equal(focus.outline, "3px");
        assert.ok(focus.top >= 0);
        await page.keyboard.press("Enter");
        assert.equal(new URL(page.url()).hash, "#main");

        const headerNav = width <= 900 ? page.locator(".mobile-nav") : page.locator(".desktop-nav");
        const clickHeaderLink = async (name) => {
          if (width <= 900 && await headerNav.getAttribute("open") === null) {
            await headerNav.locator("summary").click();
          }
          await headerNav.getByRole("link", { name, exact: true }).click();
        };

        await clickHeaderLink("この番組について");
        await page.waitForURL(origin + "/#about");
        assert.equal(new URL(page.url()).hash, "#about");
        await clickHeaderLink("エピソード");
        await page.waitForURL(origin + "/#episodes");
        assert.equal(new URL(page.url()).hash, "#episodes");
        await clickHeaderLink("ホーム");
        await page.waitForURL(origin + "/");
        await page.evaluate(() => window.scrollTo(0, 0));
        if (width <= 900 && await headerNav.getAttribute("open") !== null) {
          await headerNav.locator("summary").click();
        }
        results.push({ width, hero, contentItems: 3, newsItems: 5 });
      } else {
        assert.equal(await page.locator("h1").textContent(), data.title);
        const comparison = await page.evaluate((html) => {
          const expected = document.createElement("div");
          expected.innerHTML = html;
          const actual = document.querySelector(".article-body");
          const normalize = (text) => text.replace(/\s+/g, "").trim();
          return {
            bodyMatches: normalize(actual.textContent) === normalize(expected.textContent),
            links: [...actual.querySelectorAll("a")].map((link) => link.getAttribute("href")),
            expectedLinks: [...expected.querySelectorAll("a")].map((link) => link.getAttribute("href")),
            h2: actual.querySelectorAll("h2").length,
            expectedH2: expected.querySelectorAll("h2").length,
            blockquotes: actual.querySelectorAll("blockquote").length,
          };
        }, expectedHtml);
        assert.equal(comparison.bodyMatches, true, "All Markdown body text must be preserved");
        assert.deepEqual(comparison.links, comparison.expectedLinks);
        assert.equal(comparison.h2, comparison.expectedH2);
        assert.equal(comparison.blockquotes, 0);
        assert.equal(await page.locator(".article-body table").count(), 1);
        assert.equal(await page.locator(".video-link-box").count(), 0);
        assert.equal(await page.locator("iframe").count(), 0);
        results.push({ width, article: comparison });
      }
      await page.screenshot({ path: path.join(directory, `${name}-${width}.png`), fullPage: true });
      if (name === "article") {
        await page.screenshot({ path: path.join(directory, `article-top-${width}.png`) });
        await page.getByRole("heading", { name: "出典" }).scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(directory, `article-sources-${width}.png`) });
      }
      results.push({ name, ...metrics });
    }

    await page.getByRole("link", { name: "トップに戻る", exact: false }).click();
    await page.waitForURL(origin + "/");
    await page.getByRole("link", { name: "Episode 003を読む", exact: true }).click();
    await page.waitForURL(origin + articlePath);
    await page.getByRole("link", { name: "エピソードに戻る" }).click();
    await page.waitForURL(origin + "/#episodes");
    results.push({ width, navigation: "home → article → home anchor: pass", keyboard: "skip link + visible focus: pass" });
    await context.close();
  }
  assert.deepEqual(failures, [], "No browser or local HTTP errors");
  await writeFile(path.join(directory, "results.json"), JSON.stringify({ origin, failures, results }, null, 2));
  console.log(JSON.stringify({ status: "PASS", viewports: [375, 768, 1440], bodyMatchesSource: true, failures }, null, 2));
} finally {
  await browser.close();
}
