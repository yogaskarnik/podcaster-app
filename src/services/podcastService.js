import axios from 'axios';
import config from '../config';

const basURL = '/api/podcasts';
const cache = new Map();

const getCacheKey = (url, params = {}) => {
  return `${url}_${JSON.stringify(params)}`;
};

const isValidCache = (timestamp) => {
  return Date.now() - timestamp < config.CACHE_DURATION;
};

const fetchAll = async (searchQuery = '') => {
  try {
    const cacheKey = getCacheKey('fetchAll', { searchQuery });
    const cached = cache.get(cacheKey);
    
    if (cached && isValidCache(cached.timestamp)) {
      if (config.ENABLE_LOGGING) {
        console.log('Returning cached data for:', cacheKey);
      }
      return cached.data;
    }

    const params = searchQuery ? { search: searchQuery } : {};
    const response = await axios.get(basURL, { params });
    
    // Cache the response
    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });
    
    return response.data;
  } catch (error) {
    if (config.ENABLE_LOGGING) {
      console.error('Error fetching podcasts:', error);
    }
    throw new Error(error?.response?.data?.error || 'Error fetching podcasts');
  }
};

const fetchById = async (podcastId) => {
  try {
    const cacheKey = getCacheKey('fetchById', { podcastId });
    const cached = cache.get(cacheKey);
    
    if (cached && isValidCache(cached.timestamp)) {
      if (config.ENABLE_LOGGING) {
        console.log('Returning cached data for:', cacheKey);
      }
      return cached.data;
    }

    const response = await axios.get(`${basURL}/${podcastId}`);
    
    // Cache the response
    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });
    
    return response.data;
  } catch (error) {
    if (config.ENABLE_LOGGING) {
      console.error('Error fetching podcast by id:', error);
    }
    throw new Error(
      error?.response?.data?.error || 'Error fetching podcast by id'
    );
  }
};

const clearCache = () => {
  cache.clear();
};

export default { fetchAll, fetchById, clearCache };
