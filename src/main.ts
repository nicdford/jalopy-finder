// For more information, see https://crawlee.dev/
import { PlaywrightCrawler } from "crawlee";

// PlaywrightCrawler crawls the web using a headless
// browser controlled by the Playwright library.
const crawler = new PlaywrightCrawler({
  // Use the requestHandler to process each of the crawled pages.
  async requestHandler({ request, page, enqueueLinks, log, pushData }) {
    await page.locator("#yard-id").selectOption("1020"); // Select Boise yard
    await page.locator("#car-make").selectOption("BMW"); // Select all BMWs
    await page.locator("#car-model").selectOption("3 SERIES"); // Select Boise yard
    await page.locator("button").click(); // Click the search button

    const tableBody = await page.locator("table");

    if (await tableBody.isVisible()) {
      const cars = [];
      const rowCount = await tableBody.locator("tr").count();

      console.log("rowCount", rowCount);

      for (let i = 0; i < rowCount; i++) {
        cars.push(
          await page
            .locator(".table")
            .locator("tr")
            .nth(i)
            .locator("td")
            .nth(4)
            .innerText()
        );
      } //change n with your column number

      log.info(`Cars: ${cars}`);
    }

    // Save results as JSON to ./storage/datasets/default
    // await pushData({ title, url: request.loadedUrl });

    // Extract links from the current page
    // and add them to the crawling queue.
    // await enqueueLinks();
  },
  // Uncomment this option to see the browser window.
  headless: false,
});

// Add first URL to the queue and start the crawl.
await crawler.run(["http://inventory.pickapartjalopyjungle.com"]);
