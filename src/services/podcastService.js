import axios from 'axios';

const basURL = '/api/podcasts';

const fetchAll = async () => {
  try {
    const response = await axios.get(basURL);
    return response.data;
  } catch (error) {
    console.error('Error fetching podcast');
    throw new Error(error?.response?.data?.error || 'Error fetching podcast');
  }
};
//import/no-anonymous-default-export
export default { fetchAll };
