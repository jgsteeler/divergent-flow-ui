import { apiClient } from '../ApiClient';
import { CaptureSchema, CaptureListSchema } from '../schemas/captureSchema';
import type { Capture, CreateCaptureRequest, UpdateCaptureRequest } from '../schemas/captureSchema';
import { z } from 'zod';

export const captureService = {
  createCapture: async (request: CreateCaptureRequest): Promise<Capture> => {
    return apiClient('/v1/capture', CaptureSchema, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  listCapturesByUser: async (userId: string): Promise<Capture[]> => {
    return apiClient(`/v1/capture/user/${userId}`, CaptureListSchema, {
      method: 'GET',
    });
  },

  listCapturesByEmail: async (email: string, migrated?: boolean): Promise<Capture[]> => {
    const params = new URLSearchParams();
    if (migrated !== undefined) {
      params.append('migrated', String(migrated));
    }
    const queryString = params.toString();
    const url = `/v1/capture/user/email/${encodeURIComponent(email)}${queryString ? `?${queryString}` : ''}`;
    return apiClient(url, CaptureListSchema, {
      method: 'GET',
    });
  },

  updateCapture: async (request: UpdateCaptureRequest): Promise<Capture> => {
    return apiClient(`/v1/capture/${request.id}`, CaptureSchema, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  },

  deleteCapture: async (id: string): Promise<void> => {
    // DELETE returns 204 No Content, so we use a simple schema
    await apiClient(`/v1/capture/${id}`, z.unknown(), {
      method: 'DELETE',
    });
  },
};
