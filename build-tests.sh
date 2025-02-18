cd my-app/packages/backend


echo "Building model tests"
npx tsc -b tsconfig.models.spec.json


echo "Building service tests"
npx tsc -b tsconfig.services.spec.json


echo "Building controller tests"
npx tsc -b tsconfig.controllers.spec.json


cd ../..
