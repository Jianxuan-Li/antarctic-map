FROM ubuntu:18.04

ARG PROJECT_PATH=/antarctic
ARG NODE_VERSION=v12.18.2
ARG GEOSERVER_URL_VAR
ARG CPU_CORE=1

ENV GEOSERVER_URL ${GEOSERVER_URL_VAR}

# Create working dir
RUN mkdir ${PROJECT_PATH} && mkdir /statics && mkdir /data
WORKDIR ${PROJECT_PATH}
COPY . .
COPY ./site.conf /etc/nginx/sites-enabled/default
COPY ./sources.list /etc/apt/sources.list

# Set timezone
ENV TZ Etc/UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Set LANG
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

# Project initalization
ENV DJANGO_SETTINGS_MODULE "map.settings"
ENV PATH /yarnpkg/yarn-v1.22.4/bin:/nodejs/node-${NODE_VERSION}-linux-x64/bin:$PATH


RUN apt-get update -y \
    && apt-get install -y \
        gnupg2 python3 python3-gdal nginx mapnik-utils python3-mapnik \
        python3-pip wget python3-setuptools libatlas-base-dev python3-dev build-essential \
        --no-install-recommends \
    #
    # Frontend
    && wget -q -O /node.tar.gz https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.gz \
    && mkdir -p /nodejs \
    && wget -q -O /yarn.tar.gz https://github.com/yarnpkg/yarn/releases/download/v1.22.4/yarn-v1.22.4.tar.gz \
    && mkdir -p /nodejs && mkdir -p /yarnpkg \
    && tar -xzf /node.tar.gz -C /nodejs \
    && rm /node.tar.gz \
    && tar -xzf /yarn.tar.gz -C /yarnpkg \
    && rm /yarn.tar.gz \
    && yarn install --network-timeout 60000 && yarn build \
    #
    # Backend
    && pip3 --no-cache-dir install -r requirements.txt \
    && DJANGO_SETTINGS_MODULE="map.settings_docker_build" python3 manage.py collectstatic \
    #
    # Prune files
    && rm -rf ./frontend ./node_modules && yarn cache clean \
    && rm -rf /nodejs /yarnpkg \
    && apt-get purge -y python3-pip wget python3-setuptools libatlas-base-dev python3-dev build-essential \
    && apt-get clean && rm -rf /var/lib/apt/lists/* 

RUN chmod +x ./docker-entrypoint.sh
EXPOSE 9000
# ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ./docker-entrypoint.sh
