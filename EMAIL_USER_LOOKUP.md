# Email-Based User Lookup Implementation

## Overview
Updated the Divergent Flow UI to use email-based user lookup with in-memory caching instead of directly using user IDs.

## Changes Made

### 1. New Files Created

#### `src/api/schemas/userSchema.ts`
- Zod schemas for User, UserProfile, and OAuthAccount entities
- Type-safe validation for user data from API
- Exports TypeScript types for use throughout the application

#### `src/api/services/userService.ts`
- User API service with email-based lookup
- **In-memory caching** of user ID by email
- Methods:
  - `getUserByEmail(email)`: Fetch user data by email
  - `getUserIdByEmail(email)`: Fetch and cache user ID by email
  - `clearCache()`: Clear cached user data (for logout/user switching)
  - `getCachedUserId()`: Get cached user ID without API call

### 2. Modified Files

#### `src/config.ts`
- Changed `USER_ID` to `USER_EMAIL` in configuration interface
- Updated fallback config to use default email instead of UUID

#### `src/api/services/captureService.ts`
- Added `listCapturesByEmail()` method for direct email-based capture listing
- Supports optional `migrated` query parameter

#### `scripts/generate-config.mjs`
- Updated to use `USER_EMAIL` instead of `USER_ID`
- Reads `USER_EMAIL` from `.env.dev` file

#### Environment Files
- `.env.dev` - Updated to use `USER_EMAIL` (currently: `jgsteeler@gmail.com`)
- `.env.dev.example` - Updated example to use `USER_EMAIL`

#### Component Updates (all use email-based lookup now):
- `src/components/DivergentDashboard.tsx`
- `src/components/BulkCaptureForm.tsx`
- `src/components/CaptureGrid.tsx`
- `src/components/SingleCaptureForm.tsx`

All components now:
1. Get email from config (`USER_EMAIL`)
2. Call `userService.getUserIdByEmail(email)` to get cached or fresh user ID
3. Use the user ID for capture operations

## Caching Behavior

The user service implements **in-memory caching**:

- **First call**: API request to `/v1/user/email/{email}` → caches user ID
- **Subsequent calls**: Returns cached user ID immediately (no API call)
- **Cache invalidation**: Call `userService.clearCache()` when needed

### Benefits:
- Reduces API calls
- Improves performance
- Maintains consistency during user session
- Simple implementation (no external dependencies)

### Limitations:
- Cache clears on page refresh (browser reload)
- Single user per session (by design)
- No persistence across sessions

## API Endpoints Used

### User Endpoints
- `GET /v1/user/email/{email}` - Get user by email

### Capture Endpoints
- `POST /v1/capture` - Create capture (requires userId)
- `GET /v1/capture/user/{userId}` - List captures by user ID
- `GET /v1/capture/user/email/{email}` - List captures by email (new)
- `PUT /v1/capture/{id}` - Update capture
- `DELETE /v1/capture/{id}` - Delete capture

## Configuration

### Environment Variables

Update your `.env.dev` file to include `USER_EMAIL`:

```bash
API_BASE_URL=http://localhost:8081
NEURO_MODE=divergent
ENVIRONMENT=development
USER_EMAIL=user@example.com  # Changed from USER_ID
```

### Runtime Configuration

The `generate-config.mjs` script reads the `.env.dev` file and creates `dist/config/config.json`:

```javascript
window.appConfig = {
  API_BASE_URL: 'http://localhost:8081',
  NEURO_MODE: 'divergent',
  VERSION: '0.1.7',
  ENVIRONMENT: 'development',
  USER_EMAIL: 'user@example.com', // Changed from USER_ID
};
```

## Testing Checklist

- [ ] User lookup by email works correctly
- [ ] User ID is cached after first lookup
- [ ] Captures can be created with email-based user lookup
- [ ] Capture listing works with email-based lookup
- [ ] Bulk capture works with cached user ID
- [ ] Edit/delete operations work correctly
- [ ] Error handling for invalid email
- [ ] Error handling for non-existent user

## Future Enhancements

1. **LocalStorage persistence**: Persist cache across page reloads
2. **Multi-user support**: Cache multiple users if needed
3. **TTL-based cache**: Add expiration to cached data
4. **React Context**: Share user data across components via context
5. **Error recovery**: Better handling of stale cache scenarios
