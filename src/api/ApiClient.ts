// src/api/ApiClient.ts
import { z } from 'zod';
import type { ZodSchema } from 'zod';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(
  path: string,
  schema: ZodSchema<T>,
  options: RequestInit = {}
): Promise<T> {
  // Use VITE_API_URL injected at build time by Vite
  const baseUrl = import.meta.env.VITE_API_URL;
  const url = `${baseUrl}${path}`;
  // Auth will be added later (client credentials)
  // const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    // ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };
  const response = await fetch(url, { 
    ...options, 
    headers: {
      ...headers,
      'Cache-Control': 'no-cache', // Disable caching to avoid 304 responses
    }
  });
  
  if (!response.ok) {
    let errorDetail = response.statusText;
    try { errorDetail = await response.text(); } catch { /* ignore parse error */ }
    throw new ApiError(`API call failed (${response.status}): ${errorDetail}`, response.status);
  }
  const json = await response.json();
  try {
    return schema.parse(json);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Zod Validation Error:', error.issues);
      throw new ApiError('Received invalid data from server.', 500);
    }
    throw error;
  }
}
