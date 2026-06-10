import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const ACCESS_KEY = "softit_access_token";
const REFRESH_KEY = "softit_refresh_token";

const rawApi = axios.create({ baseURL });
export const api = axios.create({ baseURL });

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

/* attach token */
api.interceptors.request.use((config) => {
  if (isBrowser()) {
    const access = window.localStorage.getItem(ACCESS_KEY);

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
      clearTokens();
      window.location.href = "/login";
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
      clearTokens();
      window.location.href = "/login";
      return Promise.reject(e);
    }
  }
);
