import axios from 'axios';

// No backend endpoints exist yet — this client is wired up so future
// features (e.g. server-side workspace storage) can start making requests
// without any additional setup.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
