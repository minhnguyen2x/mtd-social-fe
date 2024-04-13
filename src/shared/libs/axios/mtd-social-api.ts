import axios from 'axios';

export let BASE_ENDPOINT = '';

const APP_ENVIRONMENT = import.meta.env.VITE_APP_ENVIRONMENT as 'local' | 'development' | 'staging' | 'production';
if (!APP_ENVIRONMENT) throw new Error('APP_ENVIRONMENT is not set');

if (APP_ENVIRONMENT === 'local') {
  BASE_ENDPOINT = 'http://127.0.0.1:9876';
} else if (APP_ENVIRONMENT === 'development') {
  BASE_ENDPOINT = 'https://api.dev.<your-backend-domain>';
} else if (APP_ENVIRONMENT === 'staging') {
  BASE_ENDPOINT = 'https://api.stg.<your-backend-domain>';
} else if (APP_ENVIRONMENT === 'production') {
  BASE_ENDPOINT = 'https://api.<your-backend-domain>';
}

const BASE_URL = `${BASE_ENDPOINT}/api/v1`;

export const mtdSocialAPI = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true
});
