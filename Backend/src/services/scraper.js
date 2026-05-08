const axios = require('axios');
const cheerio = require('cheerio');
const Story = require('../models/Story');

const HN_URL = 'https://news.ycombinator.com/';

/**
 * Scrape the top 10 stories from Hacker News and upsert into MongoDB.
 * Returns the array of stories that were saved.
 */
const scrapeHackerNews = async () => {
  const { data } = await axios.get(HN_URL, {
    headers: { 'User-Agent': 'Mozilla/5.0 (HN-Scraper-Assignment)' },
    timeout: 15000,
  });

  const $ = cheerio.load(data);
  const items = [];

  $('tr.athing').each((index, el) => {
    if (index >= 10) return false;

    const $row = $(el);
    const $titleLink = $row.find('.titleline > a').first();
    const title = $titleLink.text().trim();
    const url = $titleLink.attr('href') || '';

    // Subtext row immediately follows the .athing row
    const $subtext = $row.next().find('.subtext');
    const pointsText = $subtext.find('.score').text().trim(); // e.g. "123 points"
    const points = parseInt(pointsText, 10) || 0;
    const author = $subtext.find('.hnuser').text().trim() || 'unknown';
    const postedAt = $subtext.find('.age').text().trim();

    if (title && url) {
      items.push({ title, url, points, author, postedAt });
    }
  });

  // Upsert by URL so re-scraping doesn't create duplicates
  const saved = await Promise.all(
    items.map((item) =>
      Story.findOneAndUpdate({ url: item.url }, item, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      })
    )
  );

  console.log(`Scraper: saved/updated ${saved.length} stories`);
  return saved;
};

module.exports = { scrapeHackerNews };
