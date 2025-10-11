const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
const pkgPath = path.resolve(__dirname, '../package.json');

function getVersion() {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  return pkg.version;
}

function updateEnvVersion() {
  const version = getVersion();
  let env = fs.readFileSync(envPath, 'utf8');
  const regex = /^VITE_UI_VERSION=.*/m;
  if (regex.test(env)) {
    env = env.replace(regex, `VITE_UI_VERSION=${version}`);
  } else {
    env += `\nVITE_UI_VERSION=${version}`;
  }
  fs.writeFileSync(envPath, env, 'utf8');
  console.log(`Updated .env VITE_UI_VERSION to ${version}`);
}

updateEnvVersion();
