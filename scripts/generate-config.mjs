// scripts/generate-config.mjs
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const envPath = path.resolve(process.cwd(), '.env');
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
  API_BASE_URL: env.API_BASE_URL || 'http://localhost:8080',
  NEURO_MODE: env.NEURO_MODE || 'typical',
  VERSION: pkg.version || '0.0.0',
};

// Ensure dist/config exists
fs.mkdirSync(distConfigDir, { recursive: true });

// Write config.json
fs.writeFileSync(distConfigFile, JSON.stringify(config, null, 2));

console.log('Generated dist/config/config.json:', config);
