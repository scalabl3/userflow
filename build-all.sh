#!/bin/bash
set -e  # Exit on error

echo "Building Shared Package..."
cd my-app/packages/shared
npm run build
cd ../backend

echo "Building Models..."
npx tsc -b tsconfig.models.json

echo "Building Services..."
npx tsc -b tsconfig.services.json

echo "Building Backend..."
npm run build

cd ../..

#echo "Building Frontend"
# cd ../frontend
#npm run build
