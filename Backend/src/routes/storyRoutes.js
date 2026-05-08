const express = require('express');
const {
  getStories,
  getStoryById,
  toggleBookmark,
  getMyBookmarks,
} = require('../controllers/storyController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getStories);
router.get('/bookmarks/me', protect, getMyBookmarks);
router.get('/:id', getStoryById);
router.post('/:id/bookmark', protect, toggleBookmark);

module.exports = router;
