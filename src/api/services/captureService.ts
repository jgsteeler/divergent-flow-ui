import { apiClient } from '../ApiClient';
import { CaptureSchema } from '../schemas/captureSchema';
import type { Capture, CreateCaptureRequest } from '../schemas/captureSchema';

export const captureService = {
  createCapture: async (request: CreateCaptureRequest): Promise<Capture> => {
    return apiClient('/v1/capture', CaptureSchema, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },
};
