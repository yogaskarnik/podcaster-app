require('dotenv').config();
const podcastsRouter = require('express').Router();
const axios = require('axios');
const BASE_URL = process.env.REACT_APP_PODCAST_BASE_URL;
const PODCAST_APP = process.env.REACT_APP_PODCAST;
const PODCAST_DETAIL = process.env.REACT_APP_PODCAST_DETAIL;
const PODCAST_LIMIT = process.env.REACT_APP_PODCAST_LIMIT;
const PODCAST_GENRE = process.env.REACT_APP_PODCAST_GENRE;
const PODCAST_MEDIA = process.env.REACT_APP_PODCAST_MEDIA;
const PODCAST_ENTITY = process.env.REACT_APP_PODCAST_ENTITY;
const PODCAST_OUTPUT = process.env.REACT_APP_PODCAST_OUTPUT;

const URL_FETCH_ALL = `${BASE_URL}${PODCAST_APP}${PODCAST_LIMIT}=4${PODCAST_GENRE}=1310${PODCAST_OUTPUT}`;

const URL_FETCH_BY_ID = `${BASE_URL}${PODCAST_DETAIL}?id`;

podcastsRouter.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let url = URL_FETCH_ALL;
    
    if (search) {
      url = `${BASE_URL}/search?term=${encodeURIComponent(search)}&media=podcast&entity=podcast&limit=50`;
    }
    
    console.log('Fetching URL:', url);
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    res.status(500).json({ error: 'Failed to fetch podcasts' });
  }
});

podcastsRouter.get('/:id', async (req, res) => {
  try {
    const fetchByIDURL = `${URL_FETCH_BY_ID}=${req.params.id}&media=podcast&entity=podcastEpisode&limit=20`;
    console.log('fetchByIDURL:', fetchByIDURL);

    const response = await axios.get(fetchByIDURL);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching podcast details:', error);
    res.status(500).json({ error: 'Failed to fetch podcast details' });
  }
});

module.exports = podcastsRouter;
