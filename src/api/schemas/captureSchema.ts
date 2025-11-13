import { z } from 'zod';

export const CaptureSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  rawText: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  migratedDate: z.string().datetime().nullable().optional(),
});

export const CreateCaptureRequestSchema = z.object({
  userId: z.string().uuid(),
  rawText: z.string().min(1, 'Capture text cannot be empty'),
});

export const UpdateCaptureRequestSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  rawText: z.string().min(1, 'Capture text cannot be empty'),
});

export const CaptureListSchema = z.array(CaptureSchema);

export type Capture = z.infer<typeof CaptureSchema>;
export type CreateCaptureRequest = z.infer<typeof CreateCaptureRequestSchema>;
export type UpdateCaptureRequest = z.infer<typeof UpdateCaptureRequestSchema>;
