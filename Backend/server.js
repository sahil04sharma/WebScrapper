require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { scrapeHackerNews } = require('./src/services/scraper');

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();

    if (String(process.env.SCRAPE_ON_START).toLowerCase() === 'true') {
      scrapeHackerNews().catch((err) =>
        console.error('Initial scrape failed:', err.message)
      );
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

start();
