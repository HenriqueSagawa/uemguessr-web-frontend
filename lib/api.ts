export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export interface ApiEnvelope<T> {
  status: string;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const TOKEN_STORAGE_KEY = "uemguessr-access-token";

let accessToken: string | null = null;
let accessTokenLoaded = false;

function readTokenFromStorage(): string | null {
  try {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // storage indisponível — segue com sessão só em memória
  }
  return null;
}

export function getAccessToken() {
  if (!accessTokenLoaded) {
    accessTokenLoaded = true;
    accessToken = readTokenFromStorage();
  }
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  accessTokenLoaded = true;
  try {
    if (typeof window !== "undefined") {
      if (token) {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    }
  } catch {
    // storage indisponível — mantém o token só em memória
  }
}

let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const body = await response.json().catch(() => null);
        const token: string | null = body?.data?.accessToken ?? null;
        if (response.ok && token) {
          setAccessToken(token);
        }
        return token;
      } catch {
        return null;
      } finally {
        refreshInFlight = null;
      }
    })();
  }
  return refreshInFlight;
}

type ApiOptions = RequestInit;

async function doFetch(path: string, options: ApiOptions, token?: string) {
  const headers = new Headers(options.headers);
  const isForm = options.body instanceof FormData;
  if (!isForm && options.body != null) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  let response = await doFetch(path, options, accessToken ?? undefined);

  if (response.status === 401 && !path.startsWith("/auth/")) {
    const token = await refreshAccessToken();
    if (token) {
      response = await doFetch(path, options, token);
    }
  }

  const body: ApiEnvelope<T> | null = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      response.status,
      body?.message ?? "Erro inesperado da API."
    );
  }
  return body!.data as T;
}

/** Tenta renovar o access token a partir do cookie httpOnly de refresh. */
export async function restoreSessionFromCookie(): Promise<boolean> {
  const token = await refreshAccessToken();
  return token !== null;
}