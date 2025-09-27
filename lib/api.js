import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4001/api';

export function apiClient(token) {
  const instance = axios.create({ baseURL: API_BASE });
  if (token) instance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return instance;
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}
