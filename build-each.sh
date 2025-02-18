cd my-app/packages/shared
npm run build  
# cd ../frontend
#npm run build
cd ../backend
#echo "Building backend"
#npm run build

echo "Building models"
npx tsc -b tsconfig.models.json


echo "Building services"
npx tsc -b tsconfig.services.json


echo "Building controllers"
npx tsc -b tsconfig.controllers.json


cd ../..
