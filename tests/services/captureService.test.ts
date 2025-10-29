import { describe, it, expect, beforeEach, vi } from 'vitest';
import { captureService } from '../../src/api/services/captureService';
import * as ApiClient from '../../src/api/ApiClient';
import type { Capture, CreateCaptureRequest, UpdateCaptureRequest } from '../../src/api/schemas/captureSchema';

// Mock the ApiClient
vi.mock('../../src/api/ApiClient', () => ({
  apiClient: vi.fn(),
}));

describe('captureService', () => {
  const mockApiClient = ApiClient.apiClient as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createCapture', () => {
    it('should create a capture successfully', async () => {
      const request: CreateCaptureRequest = {
        userId: 'user-123',
        rawText: 'Test capture',
      };

      const mockResponse: Capture = {
        id: 'capture-123',
        userId: 'user-123',
        rawText: 'Test capture',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        migrated: false,
      };

      mockApiClient.mockResolvedValue(mockResponse);

      const result = await captureService.createCapture(request);

      expect(mockApiClient).toHaveBeenCalledWith(
        '/v1/capture',
        expect.anything(),
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when creating capture', async () => {
      const request: CreateCaptureRequest = {
        userId: 'user-123',
        rawText: 'Test capture',
      };

      mockApiClient.mockRejectedValue(new Error('API Error'));

      await expect(captureService.createCapture(request)).rejects.toThrow('API Error');
    });
  });

  describe('listCapturesByUser', () => {
    it('should list captures by user ID', async () => {
      const userId = 'user-123';
      const mockCaptures: Capture[] = [
        {
          id: 'capture-1',
          userId,
          rawText: 'Capture 1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          migrated: false,
        },
        {
          id: 'capture-2',
          userId,
          rawText: 'Capture 2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          migrated: false,
        },
      ];

      mockApiClient.mockResolvedValue(mockCaptures);

      const result = await captureService.listCapturesByUser(userId);

      expect(mockApiClient).toHaveBeenCalledWith(
        `/v1/capture/user/${userId}`,
        expect.anything(),
        { method: 'GET' }
      );
      expect(result).toEqual(mockCaptures);
    });
  });

  describe('listCapturesByEmail', () => {
    it('should list captures by email without migrated filter', async () => {
      const email = 'test@example.com';
      const mockCaptures: Capture[] = [
        {
          id: 'capture-1',
          userId: 'user-123',
          rawText: 'Capture 1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          migrated: false,
        },
      ];

      mockApiClient.mockResolvedValue(mockCaptures);

      const result = await captureService.listCapturesByEmail(email);

      expect(mockApiClient).toHaveBeenCalledWith(
        `/v1/capture/user/email/${encodeURIComponent(email)}`,
        expect.anything(),
        { method: 'GET' }
      );
      expect(result).toEqual(mockCaptures);
    });

    it('should list captures by email with migrated=true filter', async () => {
      const email = 'test@example.com';
      const mockCaptures: Capture[] = [];

      mockApiClient.mockResolvedValue(mockCaptures);

      const result = await captureService.listCapturesByEmail(email, true);

      expect(mockApiClient).toHaveBeenCalledWith(
        `/v1/capture/user/email/${encodeURIComponent(email)}?migrated=true`,
        expect.anything(),
        { method: 'GET' }
      );
      expect(result).toEqual(mockCaptures);
    });

    it('should list captures by email with migrated=false filter', async () => {
      const email = 'test@example.com';
      const mockCaptures: Capture[] = [];

      mockApiClient.mockResolvedValue(mockCaptures);

      const result = await captureService.listCapturesByEmail(email, false);

      expect(mockApiClient).toHaveBeenCalledWith(
        `/v1/capture/user/email/${encodeURIComponent(email)}?migrated=false`,
        expect.anything(),
        { method: 'GET' }
      );
      expect(result).toEqual(mockCaptures);
    });

    it('should properly encode email addresses with special characters', async () => {
      const email = 'test+tag@example.com';
      mockApiClient.mockResolvedValue([]);

      await captureService.listCapturesByEmail(email);

      expect(mockApiClient).toHaveBeenCalledWith(
        `/v1/capture/user/email/${encodeURIComponent(email)}`,
        expect.anything(),
        { method: 'GET' }
      );
    });
  });

  describe('updateCapture', () => {
    it('should update a capture successfully', async () => {
      const request: UpdateCaptureRequest = {
        id: 'capture-123',
        rawText: 'Updated text',
        migrated: true,
      };

      const mockResponse: Capture = {
        id: 'capture-123',
        userId: 'user-123',
        rawText: 'Updated text',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        migrated: true,
      };

      mockApiClient.mockResolvedValue(mockResponse);

      const result = await captureService.updateCapture(request);

      expect(mockApiClient).toHaveBeenCalledWith(
        `/v1/capture/${request.id}`,
        expect.anything(),
        {
          method: 'PUT',
          body: JSON.stringify(request),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteCapture', () => {
    it('should delete a capture successfully', async () => {
      const captureId = 'capture-123';

      mockApiClient.mockResolvedValue(undefined);

      await captureService.deleteCapture(captureId);

      expect(mockApiClient).toHaveBeenCalledWith(
        `/v1/capture/${captureId}`,
        expect.anything(),
        { method: 'DELETE' }
      );
    });

    it('should handle errors when deleting capture', async () => {
      const captureId = 'capture-123';

      mockApiClient.mockRejectedValue(new Error('Delete failed'));

      await expect(captureService.deleteCapture(captureId)).rejects.toThrow('Delete failed');
    });
  });
});
