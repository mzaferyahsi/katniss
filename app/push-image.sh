export APP_NAME=$(node -p "require('./package.json').name")
export APP_VERSION=$(node -p "require('./package.json').version")

npm run build

docker push ${DOCKER_USERNAME}/${APP_NAME}:${APP_VERSION}
docker push ${DOCKER_USERNAME}/${APP_NAME}:latest