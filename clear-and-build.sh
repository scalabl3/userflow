#!/bin/bash
set -e  # Exit on error

echo "Cleaning TypeScript build artifacts..."

# Navigate to project root
cd "$(dirname "$0")"

# Clean shared package
echo "Cleaning shared package..."
rm -rf my-app/packages/shared/dist
rm -f my-app/packages/shared/tsconfig.tsbuildinfo

# Clean backend package (more thorough)
echo "Cleaning backend package..."
# Main dist folder
rm -rf my-app/packages/backend/dist
# In case of separate output folders
rm -rf my-app/packages/backend/dist-models
rm -rf my-app/packages/backend/dist-services
rm -rf my-app/packages/backend/dist-controllers
# All tsbuildinfo files
rm -f my-app/packages/backend/tsconfig.tsbuildinfo
rm -f my-app/packages/backend/tsconfig.*.tsbuildinfo
# Nest.js specific outputs
rm -rf my-app/packages/backend/node_modules/.cache

# Optional: Clean frontend if it exists
# echo "Cleaning frontend package..."
# rm -rf my-app/packages/frontend/dist
# rm -f my-app/packages/frontend/tsconfig.tsbuildinfo

echo "All build artifacts cleaned. Starting fresh build..."

# Run the standard build script
./build-all.sh

echo "Build completed successfully!"

