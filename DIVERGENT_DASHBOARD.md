# Divergent Dashboard - Implementation Notes

## Overview
The Divergent Dashboard is a minimalist interface designed for ADHD-optimized capture functionality. It displays when the neuro mode is set to "divergent".

## Components Created

### 1. `DivergentDashboard.tsx`
- **Location**: `src/components/DivergentDashboard.tsx`
- **Purpose**: Main dashboard view for divergent mode
- **Features**:
  - Large, prominent textarea for quick capture
  - Single "Capture" button for submission
  - Keyboard shortcut: `Cmd+Enter` to submit
  - Success/error feedback messages
  - Auto-clears after successful capture
  - Hamburger menu for settings

### 2. `HamburgerMenu.tsx`
- **Location**: `src/components/HamburgerMenu.tsx`
- **Purpose**: Slide-out menu for settings and version info
- **Features**:
  - Always shows as hamburger icon (☰) regardless of screen size
  - Displays UI and API versions
  - Toggle switches for:
    - Light/Dark mode
    - Divergent/Typical mode
  - Backdrop click to close
  - Fixed positioning in top-right corner

### 3. Capture API Integration
- **Schema**: `src/api/schemas/captureSchema.ts`
- **Service**: `src/api/services/captureService.ts`
- **Endpoint**: `POST /v1/capture`
- **Required Fields**:
  - `userId`: UUID (hardcoded for MVP as `00000000-0000-0000-0000-000000000001`)
  - `rawText`: String (minimum 1 character)

## Routing Logic

The `LandingPage.tsx` now acts as a router:
- **Divergent Mode** → Shows `DivergentDashboard`
- **Typical Mode** → Shows original landing page

This routing respects the persisted `neuroMode` preference in localStorage.

## User Experience

### Divergent Dashboard Flow:
1. User sees only the essential elements:
   - "Capture" title
   - "What's on your mind?" label
   - Large textarea
   - Submit button
   - Hamburger menu (top-right)

2. User types capture text
3. User presses `Cmd+Enter` or clicks "Capture" button
4. Success feedback appears (✓ Captured!)
5. Textarea clears for next capture
6. Focus returns to textarea

### Mode Switching:
1. Click hamburger menu (☰)
2. Toggle "Neuro Mode" switch
3. Dashboard/Landing page swaps immediately
4. Preference is persisted to localStorage

## Hardcoded Values (MVP)

- **User ID**: `00000000-0000-0000-0000-000000000001`
  - Located in: `DivergentDashboard.tsx` (line 8)
  - Will be replaced with authenticated user ID

## Future Enhancements

- [ ] Replace hardcoded user ID with authentication
- [ ] Add capture history view
- [ ] Add keyboard shortcuts reference
- [ ] Add capture categories/tags
- [ ] Add offline support with sync
- [ ] Add voice input for capture

## Testing Checklist

- [x] Lint passes
- [x] Build succeeds
- [ ] Manual test: Create capture in divergent mode
- [ ] Manual test: Toggle between modes persists
- [ ] Manual test: Light/dark mode works in dashboard
- [ ] Manual test: Keyboard shortcut (Cmd+Enter) works
- [ ] Manual test: Error handling when API is down
- [ ] Manual test: Hamburger menu on mobile viewport
