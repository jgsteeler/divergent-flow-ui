# Typical Mode Navigation - Implementation Notes

## Overview
Added a complete navigation system for typical mode with a horizontal top navigation bar, routing, and dedicated pages.

## Components Created

### 1. `TopNav.tsx`
- **Location**: `src/components/TopNav.tsx`
- **Purpose**: Horizontal navigation bar for typical mode
- **Features**:
  - 🏠 Home - Navigate to landing page
  - 📝 Capture - Navigate to capture management
  - ⚙️ Settings - Navigate to settings page
  - ℹ️ About - Dropdown with version info and copyright
  - Active page indicator (underline with accent color)
  - Sticky positioning (stays at top on scroll)
  - Dropdown closes on backdrop click

### 2. `SettingsPage.tsx`
- **Location**: `src/pages/SettingsPage.tsx`
- **Purpose**: Settings management page
- **Features**:
  - **Appearance Section**: Toggle between Light/Dark mode
  - **Interface Section**: Toggle between Divergent/Typical neuro mode
  - Visual cards with descriptions
  - Hover effects on buttons
  - Info tip about preference persistence

### 3. `CapturePage.tsx`
- **Location**: `src/pages/CapturePage.tsx`
- **Purpose**: Placeholder for capture CRUD functionality
- **Features**:
  - "Coming Soon" placeholder
  - Ready for future implementation of:
    - Capture list view
    - Edit/delete functionality
    - Search/filter
    - Batch operations

## Routing Implementation

### Client-Side Routing
The `LandingPage.tsx` now acts as a simple router:
- Uses `currentPage` state to track active page
- `renderPage()` function switches between page components
- No external router library needed (keeps bundle small)

### Navigation Flow
```
User clicks nav item → onNavigate(page) → setCurrentPage(page) → renderPage() → Renders correct component
```

## Mode Switching

### Divergent Mode
- **Shows**: Minimalist dashboard with hamburger menu
- **Navigation**: Hidden (hamburger menu only)

### Typical Mode  
- **Shows**: Full TopNav with all pages
- **Navigation**: Visible horizontal nav bar

## User Experience

### Typical Mode Navigation:
1. User sees TopNav at all times (sticky)
2. Current page is highlighted with accent underline
3. Click "About" to see dropdown with:
   - Divergent Flow title
   - UI Version
   - API Version
   - Copyright notice
4. Click outside dropdown to close it

### Settings Page:
1. Click ⚙️ Settings in nav
2. See two sections: Appearance and Interface
3. Toggle switches work immediately
4. Changes persist to localStorage
5. Switching to Divergent mode routes to minimal dashboard

## Configuration Updates

### USER_ID Integration
Added `USER_ID` to configuration system:
- **Config Interface**: Added `USER_ID?: string` to `IAppConfig`
- **generate-config.mjs**: Now reads `USER_ID` from `.env`
- **entrypoint.sh**: Includes `USER_ID` in Docker config generation
- **.env**: Set to local prod user ID
- **.env.dev**: Set to `5465cf2d-f812-4ed4-816c-ae879832e044` for dev API
- **DivergentDashboard**: Now uses `getConfig().USER_ID` instead of hardcoded value

## Styling

### Theme Integration
All components use the theme system:
- `theme.primary` - Main brand color (nav background)
- `theme.secondary` - Supporting elements
- `theme.accent` - Highlights and active states
- `theme.background` - Page backgrounds
- `theme.text` - Text color

### Responsive Design
- Nav adapts to smaller screens
- Dropdown positioning adjusts
- Button text wraps gracefully
- Footer stays at bottom

## Testing Checklist

- [x] Build succeeds
- [x] Lint passes
- [ ] Manual test: Navigate between pages in typical mode
- [ ] Manual test: About dropdown opens and closes
- [ ] Manual test: Settings toggles work
- [ ] Manual test: Switching to divergent mode shows dashboard
- [ ] Manual test: TopNav sticky positioning on scroll
- [ ] Manual test: Active page indicator updates correctly
- [ ] Manual test: Responsive layout on mobile viewport

## Future Enhancements

### Capture Page
- [ ] Fetch and display user's captures
- [ ] Add pagination/infinite scroll
- [ ] Add search and filtering
- [ ] Implement edit functionality
- [ ] Implement delete with confirmation
- [ ] Add bulk operations

### Navigation
- [ ] Add keyboard shortcuts (Cmd+1, Cmd+2, etc.)
- [ ] Add breadcrumbs for sub-pages
- [ ] Add page transition animations
- [ ] Add loading states during navigation

### Settings
- [ ] Add more preferences (font size, animations, etc.)
- [ ] Add export/import settings
- [ ] Add reset to defaults option
