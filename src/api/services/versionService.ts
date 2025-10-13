import { apiClient } from '../ApiClient';
import { VersionSchema } from '../schemas/versionSchema';
import type { VersionResponse } from '../schemas/versionSchema';

export const versionService = {
  getVersion: async (): Promise<VersionResponse> => {
    return apiClient('/v1/version', VersionSchema, { method: 'GET' });
  },
};
