import { z } from 'zod';

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  displayName: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  timezone: z.string().nullable().optional(),
  preferences: z.record(z.string(), z.unknown()).nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const OAuthAccountSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  provider: z.string(),
  providerAccountId: z.string(),
  tokenType: z.string().nullable().optional(),
  scope: z.string().nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string(),
  emailVerified: z.boolean(),
  password: z.string().nullable().optional(),
  lastLoginAt: z.string().datetime().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  profile: UserProfileSchema.nullable().optional(),
  oauthAccounts: z.array(OAuthAccountSchema).optional(),
});

export type User = z.infer<typeof UserSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type OAuthAccount = z.infer<typeof OAuthAccountSchema>;
