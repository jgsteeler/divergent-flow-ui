// scripts/generate-config.mjs
// Generates runtime config.json with app version from package.json
// API URL is handled by VITE_API_URL environment variable (injected at build time)
// User preferences (like neuroMode) will be stored in database user profile
import fs from 'fs';
import path from 'path';

const pkgPath = path.resolve(process.cwd(), 'package.json');
const distConfigDir = path.resolve(process.cwd(), 'dist/config');
const distConfigFile = path.join(distConfigDir, 'config.json');

// Load package.json for version
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

// Minimal config - just version info for the UI

const config = {
  service: 'divergent-flow-ui',
  version: pkg.version || '0.0.0',
  timestamp: new Date().toISOString(),
};

// Ensure dist/config exists
fs.mkdirSync(distConfigDir, { recursive: true });

// Write config.json
fs.writeFileSync(distConfigFile, JSON.stringify(config, null, 2));

console.log('Generated dist/config/config.json:', config);
