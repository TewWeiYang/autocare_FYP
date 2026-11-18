import http from './http.js';
import mock from './mock.js';

// True when no backend URL is configured and the app runs on sample data.
export const isMock = !import.meta.env.VITE_API_URL;
export const api = isMock ? mock : http;
