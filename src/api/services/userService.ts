import { apiClient } from '../ApiClient';
import { UserSchema } from '../schemas/userSchema';
import type { User } from '../schemas/userSchema';

// In-memory cache for user ID
let cachedUserId: string | null = null;
let cachedEmail: string | null = null;

export const userService = {
  /**
   * Get user by email
   */
  getUserByEmail: async (email: string, token: string): Promise<User> => {
    return apiClient(`/api/user/email/${encodeURIComponent(email)}`, UserSchema, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /**
   * Get user ID from email (with caching)
   */
  getUserIdByEmail: async (email: string, token: string): Promise<string> => {
    // Return cached ID if email matches
    if (cachedEmail === email && cachedUserId) {
      return cachedUserId;
    }

    // Fetch user and cache the result
    const user = await userService.getUserByEmail(email, token);
    cachedEmail = email;
    cachedUserId = user.id;
    
    return user.id;
  },

  /**
   * Clear the cached user ID (useful for logout or switching users)
   */
  clearCache: () => {
    cachedUserId = null;
    cachedEmail = null;
  },

  /**
   * Get the cached user ID without making an API call
   */
  getCachedUserId: (): string | null => {
    return cachedUserId;
  },
};
