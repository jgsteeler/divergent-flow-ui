// scripts/update-ui-version.js
// Updates VITE_UI_VERSION in .env to match package.json version

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
const pkgPath = path.join(__dirname, '../package.json');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;

let env = fs.readFileSync(envPath, 'utf8');

if (env.match(/^VITE_UI_VERSION=/m)) {
  env = env.replace(/^VITE_UI_VERSION=.*/m, `VITE_UI_VERSION=${version}`);
} else {
  env += `\nVITE_UI_VERSION=${version}\n`;
}

fs.writeFileSync(envPath, env, 'utf8');
console.log(`Updated .env: VITE_UI_VERSION=${version}`);
