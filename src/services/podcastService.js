import axios from 'axios';

const basURL = '/api/podcasts';

const fetchAll = async (searchQuery = '') => {
  try {
    const params = searchQuery ? { search: searchQuery } : {};
    const response = await axios.get(basURL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching podcasts');
    throw new Error(error?.response?.data?.error || 'Error fetching podcasts');
  }
};

const fetchById = async (podcastId) => {
  try {
    const response = await axios.get(`${basURL}/${podcastId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching podcast by id');
    throw new Error(
      error?.response?.data?.error || 'Error fetching podcast by id'
    );
  }
};

export default { fetchAll, fetchById };
