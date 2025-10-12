#!/bin/sh

# Path where the static files are served (Nginx default)
CONFIG_FILE_PATH=/usr/share/nginx/html/config/config.json
CONFIG_DIR=$(dirname "$CONFIG_FILE_PATH")

# Create the config directory if it doesn't exist
mkdir -p "$CONFIG_DIR"

# Generate the config.json file from runtime environment variables
# Use ${VAR:-default} for safe defaults

# Extract version from /package.json, fallback to 0.0.0 if missing
VERSION_VALUE="0.0.0"
if [ -f /package.json ]; then
  VERSION_VALUE=$(grep '"version"' /package.json | head -1 | sed -E 's/.*"version": *"([^"]+)".*/\1/')
fi

echo "Generating runtime configuration..."
cat > "$CONFIG_FILE_PATH" <<EOF
{
  "API_BASE_URL": "${API_BASE_URL:-http://localhost:3000/api}",
  "NEURO_MODE": "${NEURO_MODE:-typical}",
  "VERSION": "${VERSION_VALUE}"
}
EOF

echo "Configuration file generated:"
cat "$CONFIG_FILE_PATH"
echo "---"

# Execute the main container command (Nginx)
exec "$@"
