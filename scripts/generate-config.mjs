// scripts/generate-config.mjs
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const envPath = path.resolve(process.cwd(), '.env.dev');
const pkgPath = path.resolve(process.cwd(), 'package.json');
const distConfigDir = path.resolve(process.cwd(), 'dist/config');
const distConfigFile = path.join(distConfigDir, 'config.json');

// Load .env
let env = {};
if (fs.existsSync(envPath)) {
  env = dotenv.parse(fs.readFileSync(envPath));
}

// Load package.json
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

// Compose config
const config = {
  API_BASE_URL: env.API_BASE_URL || 'http://localhost:8081',
  NEURO_MODE: env.NEURO_MODE || 'typical',
  ENVIRONMENT: env.ENVIRONMENT || 'development',
  VERSION: pkg.version || '0.0.0',
  USER_ID: env.USER_ID || '00000000-0000-0000-0000-000000000001',
};

// Ensure dist/config exists
fs.mkdirSync(distConfigDir, { recursive: true });

// Write config.json
fs.writeFileSync(distConfigFile, JSON.stringify(config, null, 2));

console.log('Generated dist/config/config.json:', config);
