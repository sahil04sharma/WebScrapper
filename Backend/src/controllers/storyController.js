const Story = require('../models/Story');
const { scrapeHackerNews } = require('../services/scraper');

// GET /api/stories?page=1&limit=10
const getStories = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
  const skip = (page - 1) * limit;

  const [stories, total] = await Promise.all([
    Story.find().sort({ points: -1 }).skip(skip).limit(limit),
    Story.countDocuments(),
  ]);

  res.json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
    stories,
  });
};

// GET /api/stories/:id
const getStoryById = async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) return res.status(404).json({ message: 'Story not found' });
  res.json(story);
};

// POST /api/stories/:id/bookmark  (auth required)
const toggleBookmark = async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) return res.status(404).json({ message: 'Story not found' });

  const user = req.user;
  const idx = user.bookmarks.findIndex((b) => b.toString() === story._id.toString());

  let bookmarked;
  if (idx === -1) {
    user.bookmarks.push(story._id);
    bookmarked = true;
  } else {
    user.bookmarks.splice(idx, 1);
    bookmarked = false;
  }

  await user.save();
  res.json({ bookmarked, storyId: story._id, bookmarks: user.bookmarks });
};

// GET /api/stories/bookmarks/me  (auth required)
const getMyBookmarks = async (req, res) => {
  const populated = await req.user.populate({
    path: 'bookmarks',
    options: { sort: { points: -1 } },
  });
  res.json({ bookmarks: populated.bookmarks });
};

// POST /api/scrape  (manual trigger)
const triggerScrape = async (req, res) => {
  try {
    const stories = await scrapeHackerNews();
    res.json({ message: 'Scrape complete', count: stories.length, stories });
  } catch (err) {
    res.status(500).json({ message: 'Scrape failed', error: err.message });
  }
};

module.exports = {
  getStories,
  getStoryById,
  toggleBookmark,
  getMyBookmarks,
  triggerScrape,
};
