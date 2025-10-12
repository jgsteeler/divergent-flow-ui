import { z } from 'zod';

export const VersionSchema = z.object({
  version: z.string(),
  service: z.string().optional(),
  timestamp: z.string().optional(),
});

export type VersionResponse = z.infer<typeof VersionSchema>;
