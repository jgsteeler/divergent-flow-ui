# Capture Page CRUD - Implementation Notes

## Overview
Implemented full CRUD functionality for the Capture page in typical mode with three tabs: Single Capture, Bulk Capture, and View Captures.

## Components Created

### 1. `SingleCaptureForm.tsx`
- **Location**: `src/components/SingleCaptureForm.tsx`
- **Purpose**: Form to capture one item at a time
- **Features**:
  - Textarea for capture input
  - Submit button with disabled state when empty
  - Success/error feedback messages
  - Auto-clears after successful capture
  - Callback to notify parent component

### 2. `BulkCaptureForm.tsx`
- **Location**: `src/components/BulkCaptureForm.tsx`
- **Purpose**: Form to capture multiple items at once
- **Features**:
  - Large textarea for multiple captures (one per line)
  - Real-time count of non-empty lines
  - Splits input by newlines and creates all captures in parallel
  - Shows count in submit button (e.g., "Capture 5 Items")
  - Success message shows total captured
  - Callback to notify parent component

### 3. `CaptureGrid.tsx`
- **Location**: `src/components/CaptureGrid.tsx`
- **Purpose**: Display and manage unmigrated captures
- **Features**:
  - Lists all unmigrated captures (filtered by `migratedDate === null`)
  - Inline editing with textarea
  - Edit/Save/Cancel buttons
  - Delete with confirmation dialog
  - Refresh button to reload list
  - Shows count in header
  - Loading, error, and empty states
  - Displays timestamp for each capture
  - Accepts `refreshTrigger` prop to reload from parent

## API Service Enhancements

### Updated `captureService.ts`
Added the following methods:
- `listCapturesByUser(userId)` - GET /v1/capture/user/:userId
- `updateCapture(request)` - PUT /v1/capture/:id
- `deleteCapture(id)` - DELETE /v1/capture/:id

### Updated `captureSchema.ts`
Added schemas:
- `UpdateCaptureRequestSchema` - for PUT requests
- `CaptureListSchema` - for GET list responses

## CapturePage Implementation

### Tab Navigation
Three tabs with visual indicators:
- **📝 Single Capture** - One at a time
- **📋 Bulk Capture** - Multiple items
- **📂 View Captures** - List all unmigrated

### Tab Behavior
- Active tab has primary color background
- Inactive tabs have transparent background
- Smooth transitions between tabs
- Active tab rounded top corners

### User Flow
1. User captures item(s) in Single or Bulk tab
2. After successful capture, automatically switches to View Captures tab
3. Capture list refreshes to show new items
4. User can edit or delete captures inline

## Features

### Single Capture
- Simple textarea and submit button
- Validates non-empty input
- Shows success message (✓ Captured successfully!)
- Clears form after success
- Auto-switches to list view

### Bulk Capture
- Enter multiple captures, one per line
- Real-time line counter
- Batch creates all captures in parallel
- Shows total count (✓ Successfully captured 5 items!)
- Clears form after success
- Auto-switches to list view

### View Captures (Grid)
**List View:**
- Displays all unmigrated captures
- Shows capture text and timestamp
- Edit and Delete buttons for each item

**Edit Mode:**
- Click ✏️ Edit to enter edit mode
- Inline textarea appears
- ✓ Save button to commit changes
- Cancel button to discard changes
- Validates non-empty input

**Delete:**
- Click 🗑️ Delete button
- Confirmation dialog appears
- Removes from list on confirm

**States:**
- Loading: "Loading captures..."
- Error: Shows error with Retry button
- Empty: Shows 📭 icon and "No unmigrated captures yet"
- Success: Grid of capture cards

## Data Flow

### Create Flow
1. User fills form (Single or Bulk)
2. Submits form
3. API POST /v1/capture
4. Success feedback shown
5. `onCaptureCreated()` callback fires
6. Parent increments `refreshTrigger`
7. Grid re-fetches data
8. Tab switches to View Captures

### Edit Flow
1. User clicks Edit on a capture
2. Textarea appears with current text
3. User modifies and clicks Save
4. API PUT /v1/capture/:id
5. Local state updates immediately
6. No refresh needed (optimistic update)

### Delete Flow
1. User clicks Delete
2. Confirmation dialog appears
3. On confirm: API DELETE /v1/capture/:id
4. Local state filters out deleted item
5. No refresh needed (optimistic update)

### List Flow
1. Component mounts or `refreshTrigger` changes
2. API GET /v1/capture/user/:userId
3. Filter for unmigrated (where `migratedDate` is null)
4. Display in grid

## Styling

### Theme Integration
All components use theme colors:
- `theme.primary` - Headers, active tabs, success messages
- `theme.secondary` - Borders, inactive states, refresh button
- `theme.accent` - Submit buttons, save buttons
- `theme.background` - Backgrounds, input backgrounds
- `theme.text` - Text content

### Responsive Design
- Form inputs are 100% width
- Grid items stack vertically
- Buttons adapt to content
- Mobile-friendly touch targets

## Error Handling

### Network Errors
- Caught and displayed in feedback messages
- Retry button available in error state
- Error messages extracted from Error objects

### Validation Errors
- Empty text validation before submit
- Empty text validation before save
- User-friendly error messages

### Confirmation Dialogs
- Delete requires confirmation
- Prevents accidental data loss

## Testing Checklist

- [x] Build succeeds
- [x] Lint passes
- [ ] Manual test: Create single capture
- [ ] Manual test: Create multiple captures in bulk
- [ ] Manual test: View captures list
- [ ] Manual test: Edit a capture
- [ ] Manual test: Cancel edit
- [ ] Manual test: Delete a capture
- [ ] Manual test: Refresh button works
- [ ] Manual test: Empty state displays correctly
- [ ] Manual test: Tab switching works
- [ ] Manual test: Auto-switch to list after capture

## Future Enhancements

### Filtering & Search
- [ ] Add search box to filter by text
- [ ] Add date range filter
- [ ] Add sort options (newest, oldest, alphabetical)

### Pagination
- [ ] Add pagination for large lists
- [ ] Add "Load More" button
- [ ] Add infinite scroll option

### Batch Operations
- [ ] Add select all checkbox
- [ ] Add delete selected button
- [ ] Add migrate selected button

### Export/Import
- [ ] Export captures to CSV/JSON
- [ ] Import captures from file
- [ ] Bulk edit via spreadsheet

### Enhanced Editing
- [ ] Add keyboard shortcuts (Escape to cancel, Ctrl+Enter to save)
- [ ] Add undo/redo for edits
- [ ] Add auto-save drafts

### UI Improvements
- [ ] Add animations for list updates
- [ ] Add drag-and-drop reordering
- [ ] Add expand/collapse for long captures
- [ ] Add tags/labels to captures
