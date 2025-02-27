import axios from 'axios';

const GIPHY_URL = 'https://api.giphy.com/v1/gifs';
const API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY;
if (!API_KEY) throw new Error('API_KEY is not set');

class GiphyService {
  async search(query) {
    const response = await axios.get(`${GIPHY_URL}/search`, { params: { api_key: API_KEY, q: query } });
    return response;
  }

  async trending() {
    const response = await axios.get(`${GIPHY_URL}/trending`, { params: { api_key: API_KEY } });
    return response;
  }
}

export const giphyService = new GiphyService();
