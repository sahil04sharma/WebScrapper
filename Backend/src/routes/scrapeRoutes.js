const express = require('express');
const { triggerScrape } = require('../controllers/storyController');

const router = express.Router();

router.post('/', triggerScrape);

module.exports = router;
