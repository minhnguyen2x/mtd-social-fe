import axios from 'axios';

export let BASE_ENDPOINT = '';

const APP_ENVIRONMENT = import.meta.env.VITE_APP_ENVIRONMENT as 'local' | 'development' | 'staging' | 'production';
if (!APP_ENVIRONMENT) throw new Error('APP_ENVIRONMENT is not set');

switch (APP_ENVIRONMENT) {
  case 'local':
    BASE_ENDPOINT = 'http://127.0.0.1:9876';
    break;
  case 'development':
    BASE_ENDPOINT = 'https://api.dev.<your-backend-domain>';
    break;
  case 'staging':
    BASE_ENDPOINT = 'https://api.stg.<your-backend-domain>';
    break;
  case 'production':
    BASE_ENDPOINT = 'https://api.<your-backend-domain>';
    break;
  default:
    console.error('Invalid APP_ENVIRONMENT value');
    throw new Error('Invalid APP_ENVIRONMENT value');
}

export const BASE_URL = `${BASE_ENDPOINT}/api/v1`;

export const mtdSocialAPI = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true
});
