require('dotenv').config();
const podcastsRouter = require('express').Router();
const axios = require('axios');
const BASE_URL = process.env.ITUNES_PODCAST_URI;

podcastsRouter.get('/', async (req, res) => {
  try {
    const response = await axios.get(BASE_URL);
    res.json(response.data);
  } catch (error) {
    console.error('backend: Error fetching podcast', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = podcastsRouter;
