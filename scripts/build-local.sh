#! /bin/bash

npm run build -prefix client
rm -rf deploy.zip
rm -rf temp
mkdir temp

mkdir temp/build
cp -r client/build/. temp/build
mkdir temp/src
cp -r server/src/. temp/src

cp -r server/package-lock.json temp
cp -r server/package.json temp
cp -r server/README.md temp
cp -r server/favicon.ico temp

cd temp
zip -r ../deploy.zip *

echo "---------------- BUILD SUCCESS ----------------"
echo "|                                             |"
echo "| Deployment package successfully built!      |"
echo "| You can find that in the deploy.zip file    |"
echo "|                                             |"
echo "| Make sure that the React application        |"
echo "| did build properly by checking logs!        |"
echo "|                                             |"
echo "-----------------------------------------------"