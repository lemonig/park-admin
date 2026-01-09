import type { ApiResponse } from './types';
import { cookies } from 'next/headers';

interface ServerFetchOptions extends RequestInit {
  auth?: boolean;
}

export async function serverRequest<T>(
  url: string,
  options: ServerFetchOptions = {}
): Promise<T> {
  const { auth = true, headers, ...rest } = options;

  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  const res = await fetch(`${process.env.API_BASE_URL}${url}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}`);
  }

  const data = (await res.json()) as ApiResponse<T>;

  if (data.code !== 200) {
    throw new Error(data.message);
  }

  return data.data;
}
