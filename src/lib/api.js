import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const ACCESS_KEY = "softit_access_token";
const REFRESH_KEY = "softit_refresh_token";

const rawApi = axios.create({ baseURL });
export const api = axios.create({ baseURL });

function isTokenExpired(token) {
  if (!token) return true;
  try {
  
    const payload = token.split(".")[1];
    if (!payload) return true;
    
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));
    const exp = decoded.exp; 
    if (!exp) return false; 
    return Date.now() >= exp * 1000;
  } 
  
  catch (e) {
    return true;
  }
}

if (isBrowser()) {
  const storedAccess = window.localStorage.getItem(ACCESS_KEY);
  const currentPath = window.location.pathname;

  const isAdminRoute = currentPath.startsWith('/admin');

  if (isAdminRoute && (!storedAccess || isTokenExpired(storedAccess))) {
    clearTokens();
    window.location.replace('/login');
  }
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function getStoredTokens() {
  if (!isBrowser()) return { access: null, refresh: null };

  return {
    access: window.localStorage.getItem(ACCESS_KEY),
    refresh: window.localStorage.getItem(REFRESH_KEY),
  };
}

export function saveTokens({ access, refresh }) {
  if (!isBrowser()) return;

  if (access) window.localStorage.setItem(ACCESS_KEY, access);
  if (refresh) window.localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  if (!isBrowser()) return;

  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
}

export function logout() {
  clearTokens();
  if (isBrowser()) window.location.href = "/login";
}

export async function loginWithCredentials(username, password) {
  const { data } = await rawApi.post("/api/token/", {
    username,
    password,
  });

  saveTokens(data);
  return data;
}


export function listItems(data) {
  if (Array.isArray(data)) return data;
  return data?.results || [];
}

export async function fetchAll(path, { publicRequest = false } = {}) {
  const client = publicRequest ? rawApi : api;
  const { data } = await client.get(path);
  return listItems(data);
}


api.interceptors.request.use((config) => {
  if (isBrowser()) {
    const access = window.localStorage.getItem(ACCESS_KEY);
    if (!access || isTokenExpired(access)) {
      
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      clearTokens();
      
      if (isAdminRoute) {
        window.location.href = "/login";
      }
      return config;
    }

    if (access) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${access}`;
    }
  }

  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (status !== 401 || !isBrowser() || originalRequest?._retry) {
      return Promise.reject(error);
    }

    const refresh = window.localStorage.getItem(REFRESH_KEY);

    if (!refresh) {
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      clearTokens();
      if (isAdminRoute) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise =
        refreshPromise ||
        rawApi
          .post("/api/token/refresh/", { refresh })
          .then((res) => res.data)
          .finally(() => (refreshPromise = null));

      const data = await refreshPromise;

      saveTokens({
        access: data.access,
        refresh: data.refresh || refresh,
      });

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${data.access}`;

      return api(originalRequest);
    } catch (e) {
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      clearTokens();
      if (isAdminRoute) {
        window.location.href = "/login";
      }
      return Promise.reject(e);
    }
  }
);
