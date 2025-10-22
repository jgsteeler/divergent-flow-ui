# Divergent Flow UI - Warp Instructions

## Project Overview
React/TypeScript frontend interface for the Divergent Flow ADHD-optimized productivity system using Vite and Material-UI.

## Technology Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 4.5.0
- **UI Library**: Material-UI (MUI) v7
- **HTTP Client**: Axios
- **State Management**: React built-in (hooks)
- **Styling**: Emotion (MUI's CSS-in-JS solution)

## Quick Development Setup

### Prerequisites
- Node.js >= 18.0.0
- divergent-flow-core API running (for data)

### Development Commands
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Serve built application (development)
npm run dev

# Lint code
npm run lint
```

## Build Process

### Vite Configuration
The project uses Vite for fast development and optimized production builds:

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Post-Build Process
After building, the application runs a configuration generation script:
```bash
# Automatically runs after build
npm run postbuild  # Executes generate-config.mjs
```

## Docker Development

### Docker Commands
```bash
# Build and start UI service
npm run docker:up

# Production mode
npm run docker:up:prod

# Development mode
npm run docker:up:dev

# Stop services
npm run docker:down

# View logs
npm run docker:logs:prod  # or docker:logs:dev

# Clean rebuild
npm run docker:build
```

### Deployment Modes
- **Production**: Serves built static files on port 6137
- **Development**: Hot reload development server

## API Integration

### OpenAPI Client Generation
The UI uses generated TypeScript clients from the Core API:

```bash
# Ensure Core API is running first
cd ../divergent-flow-core && npm run dev

# Generate API client (run from project root)
npm run generate:api-client
```

### API Configuration
- **Development**: Points to `http://localhost:8080`
- **Production**: Configurable via environment variables

## Development Workflow

### Local Development Setup
1. **Start Core API**:
   ```bash
   cd ../divergent-flow-core
   npm run dev
   ```

2. **Start UI Development**:
   ```bash
   npm install
   npm run build  # Initial build
   npm run dev    # Serve on port 6137
   ```

3. **Access Application**: http://localhost:6137

### Hot Reload Development
For development with live reload, you may need to adjust the dev script or use Vite's dev server directly.

## Code Quality

### Linting Configuration
- **ESLint**: Configured with React and TypeScript rules
- **React Hooks**: Enforced via `eslint-plugin-react-hooks`
- **React Refresh**: Hot reload support via `eslint-plugin-react-refresh`

### Linting Commands
```bash
# Run linter
npm run lint

# Auto-fix linting issues (if available)
npm run lint -- --fix
```

## Release Process

### Version Management
```bash
# Patch release (0.1.6 → 0.1.7)
npm run release

# Minor release (0.1.6 → 0.2.0)
npm run release:minor

# Major release (0.1.6 → 1.0.0)
npm run release:major
```

### Release Workflow
1. **Feature Development**: Work on feature branch using git-flow
2. **Testing**: Manual testing of UI functionality
3. **Build Verification**: Run `npm run build` to ensure no errors
4. **Lint Check**: Run `npm run lint` for code quality
5. **Release**: Use semantic versioning commands above

## Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Page-level components
├── hooks/         # Custom React hooks
├── services/      # API service layer
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── assets/        # Static assets
```

## Common Issues & Solutions

### Port 6137 Already in Use
```bash
# Find process using port
lsof -i :6137

# Kill process if safe
kill -9 <PID>

# Or use different port
PORT=3000 npm run dev
```

### API Connection Issues
1. **Ensure Core API is running**: `http://localhost:8080/health`
2. **Check CORS configuration** in Core API
3. **Verify API client generation** if using generated clients

### Build Failures
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf dist .vite
npm run build
```

### TypeScript Issues
```bash
# Type check without building
npx tsc --noEmit

# Restart TypeScript language server in editor
# VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

## Material-UI (MUI) Usage

### Theme Configuration
The application uses MUI's theming system for consistent styling.

### Component Development
- Use MUI components as building blocks
- Follow Material Design guidelines
- Implement responsive design patterns

## Environment Configuration
- **Development**: Uses local development settings
- **Production**: Configured via Docker environment variables
- **Configuration File**: Generated post-build for runtime config

## Accessibility
- Follow WCAG guidelines for ADHD-friendly interfaces
- Implement proper ARIA labels
- Ensure keyboard navigation support
- Consider cognitive load in UI design

## Git Flow Integration
```bash
# Start new feature
git flow feature start ui-enhancement

# Development workflow
npm run build  # Verify build works
npm run lint   # Check code quality

# Finish feature
git flow feature finish ui-enhancement

# Create release
git flow release start 0.2.0
npm run release:minor
git flow release finish 0.2.0
```