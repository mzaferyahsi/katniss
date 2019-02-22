export APP_NAME=$(node -p "require('./package.json').name")
export APP_VERSION=$(node -p "require('./package.json').version")

docker build -t ${APP_NAME}:${APP_VERSION} .
docker tag ${APP_NAME}:${APP_VERSION} ${DOCKER_USERNAME}/${APP_NAME}:${APP_VERSION}
docker tag ${APP_NAME}:${APP_VERSION} ${DOCKER_USERNAME}/${APP_NAME}:latest