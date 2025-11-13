# Divergent Flow UI - Tests

This directory contains unit tests for the Divergent Flow UI application using Vitest and React Testing Library.

## Test Structure

```
tests/
├── components/         # Component tests
│   ├── BulkCaptureForm.test.tsx
│   └── SingleCaptureForm.test.tsx
├── services/          # API service tests
│   └── captureService.test.ts
└── utils/             # Utility function tests
    └── preferences.test.ts
```

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with UI interface
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Configuration

- **Test Framework**: Vitest
- **Testing Library**: @testing-library/react
- **DOM Environment**: happy-dom
- **Configuration**: `vite.config.ts` (test section)
- **Setup File**: `vitest.setup.ts` (runs before each test file)

## Writing Tests

### Component Tests

Component tests use React Testing Library to render components and interact with them:

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('should render and interact', async () => {
  const user = userEvent.setup();
  render(<YourComponent />);
  
  const button = screen.getByRole('button');
  await user.click(button);
  
  await waitFor(() => {
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });
});
```

### Service Tests

Service tests mock the API client and verify service methods:

```typescript
import { vi } from 'vitest';
import * as ApiClient from '../../src/api/ApiClient';

vi.mock('../../src/api/ApiClient', () => ({
  apiClient: vi.fn(),
}));

it('should call API correctly', async () => {
  const mockApiClient = ApiClient.apiClient as any;
  mockApiClient.mockResolvedValue(mockData);
  
  const result = await service.method();
  
  expect(mockApiClient).toHaveBeenCalledWith(expectedUrl, ...);
  expect(result).toEqual(mockData);
});
```

### Utility Tests

Utility tests verify pure functions and localStorage interactions:

```typescript
it('should store value in localStorage', () => {
  setUiMode('dark');
  expect(localStorage.setItem).toHaveBeenCalledWith('uiMode', 'dark');
});
```

## Test Coverage

Coverage reports are generated in the `coverage/` directory when running:

```bash
npm run test:coverage
```

Coverage includes:
- **Utilities**: 100% (preferences.ts)
- **Services**: Comprehensive API method coverage
- **Components**: User interaction, error handling, form validation

## Mocking

### Global Mocks (vitest.setup.ts)

- **localStorage**: Mocked for all tests
- **config module**: Returns test configuration

### Test-Specific Mocks

Services and API clients are mocked per test file using `vi.mock()`.

## Best Practices

1. **Arrange-Act-Assert**: Structure tests clearly
2. **User Interaction**: Use `userEvent` over `fireEvent`
3. **Async Testing**: Always use `waitFor` for async operations
4. **Cleanup**: Automatic cleanup after each test via setup file
5. **Descriptive Names**: Use clear test descriptions
6. **Mock Isolation**: Clear mocks between tests with `beforeEach`

## Common Patterns

### Testing Form Submission

```typescript
const user = userEvent.setup();
const textarea = screen.getByPlaceholderText('...');
await user.type(textarea, 'Test input');
await user.click(screen.getByRole('button'));
```

### Testing Error States

```typescript
mockService.mockRejectedValue(new Error('Error message'));
// ... trigger action
await waitFor(() => {
  expect(screen.getByText('Error message')).toBeInTheDocument();
});
```

### Testing Loading States

```typescript
let resolvePromise: any;
mockService.mockImplementation(() => 
  new Promise(resolve => { resolvePromise = resolve; })
);
// ... trigger action
expect(screen.getByText('Loading...')).toBeInTheDocument();
resolvePromise(data);
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

## Troubleshooting

### Tests Failing Locally

1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Check test setup file is being loaded
3. Verify mocks are cleared between tests

### Act Warnings

If you see React `act()` warnings, ensure async operations are properly awaited with `waitFor`.

### Module Import Errors

Verify all imports use correct relative paths and that modules are exported properly.
