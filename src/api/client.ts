const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "https://frontend-takehome-server-production.up.railway.app";

export async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}

export function getApiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}