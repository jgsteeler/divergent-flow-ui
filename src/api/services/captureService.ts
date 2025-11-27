import { apiClient } from '../ApiClient';
import { CaptureSchema, CaptureListSchema } from '../schemas/captureSchema';
import type { Capture, CreateCaptureRequest, UpdateCaptureRequest } from '../schemas/captureSchema';
import { z } from 'zod';

export const captureService = {
  createCapture: async (request: CreateCaptureRequest, token: string): Promise<Capture> => {
    return apiClient('/api/capture', CaptureSchema, {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  listCapturesByUser: async (userId: string, token: string, migrated?: boolean): Promise<Capture[]> => {
    const params = new URLSearchParams();
    if (migrated !== undefined) {
      params.append('migrated', String(migrated));
    }
    const queryString = params.toString();
    const url = `/api/capture/user/${userId}${queryString ? `?${queryString}` : ''}`;
    return apiClient(url, CaptureListSchema, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  listCapturesByEmail: async (email: string, token: string, migrated?: boolean): Promise<Capture[]> => {
    const params = new URLSearchParams();
    if (migrated !== undefined) {
      params.append('migrated', String(migrated));
    }
    const queryString = params.toString();
    const url = `/api/capture/user/email/${encodeURIComponent(email)}${queryString ? `?${queryString}` : ''}`;
    return apiClient(url, CaptureListSchema, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  updateCapture: async (request: UpdateCaptureRequest, token: string): Promise<Capture> => {
    return apiClient(`/api/capture/${request.id}`, CaptureSchema, {
      method: 'PUT',
      body: JSON.stringify(request),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  deleteCapture: async (id: string, token: string): Promise<void> => {
    // DELETE returns 204 No Content, so we use a simple schema
    await apiClient(`/api/capture/${id}`, z.unknown(), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};
