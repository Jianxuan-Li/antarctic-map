ARG PROJECT_PATH=/antarctic
ARG GEOSERVER_URL_VAR

# Frontend builder
FROM freeyeti/dev-in-docker:node-12-yarn-2 as builder

# Configure the container
ARG PROJECT_PATH
ARG GEOSERVER_URL_VAR

ENV GEOSERVER_URL $GEOSERVER_URL_VAR

RUN mkdir -p ${PROJECT_PATH}
WORKDIR ${PROJECT_PATH}
COPY . .

RUN yarn install && yarn build
RUN rm -rf ./frontend ./.yarn

# Backend Builder
FROM freeyeti/dev-in-docker:pyinstaller AS backend

ARG PROJECT_PATH

WORKDIR ${PROJECT_PATH}
COPY --from=builder ${PROJECT_PATH} ${PROJECT_PATH}

RUN pipenv lock -r > requirements.txt
RUN pip3 install --no-cache-dir -r requirements.txt
ENV DJANGO_SETTINGS_MODULE="map.settings_docker_build" 
RUN python3 manage.py collectstatic
RUN pyinstaller app.spec

# for Statics deployment and service
FROM nginx:1.19.6 AS nginx

COPY --from=backend /statics /statics
COPY ./k8s/site-static.conf /etc/nginx/conf.d/default.conf

WORKDIR /
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80

# for Django deployment and service
FROM freeyeti/dev-in-docker:ubuntu20.04-gdal AS django

# Set timezone
ENV TZ Etc/UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Set LANG
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8
ENV LANGUAGE en_US:en

ARG PROJECT_PATH
ARG GEOSERVER_URL_VAR

ENV GEOSERVER_URL $GEOSERVER_URL_VAR

ENV DJANGO_SETTINGS_MODULE="map.settings"

RUN mkdir -p /{www_data,data/{antarctic,sea_ice}}

COPY --from=backend ${PROJECT_PATH}/dist/manage ${PROJECT_PATH}
COPY --from=backend ${PROJECT_PATH}/dist/app/app ${PROJECT_PATH}/app
COPY --from=backend ${PROJECT_PATH}/webpack-stats-production.json ${PROJECT_PATH}/webpack-stats-production.json

WORKDIR ${PROJECT_PATH}

EXPOSE 8000
VOLUME [ "/www_data", "/data", "/data/antarctic" ]
