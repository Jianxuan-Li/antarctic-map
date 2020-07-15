FROM ubuntu:18.04

ARG PROJECT_PATH=/antarctic
ARG NODE_VERSION=v12.18.2

# Create working dir
RUN mkdir ${PROJECT_PATH} && mkdir /statics && mkdir /data
WORKDIR ${PROJECT_PATH}
COPY . .
COPY ./site.conf /etc/nginx/sites-enabled/default

# Set timezone
ENV TZ Etc/UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Set LANG
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

# Project initalization
ENV DJANGO_SETTINGS_MODULE "map.settings"
ENV PATH /nodejs/node-${NODE_VERSION}-linux-x64/bin:$PATH

RUN apt-get update -y \
    && apt-get install -y \
        gnupg2 make python3 python3-pip gdal-bin \
        nginx wget \
    # && rm -rf /var/lib/apt/lists/* 
    && pip3 --no-cache-dir install -r requirements.txt \
    && wget -q -O node.tar.xz https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.xz \
    && mkdir -p /nodejs \
    && tar -xJf node.tar.xz -C /nodejs \
    && rm node.tar.xz \
    && npm install -g node-gyp \
    && npm install && npm run build \
    && DJANGO_SETTINGS_MODULE="map.settings" python3 manage.py collectstatic \
    && rm -rf ./frontend ./node_modules && npm cache clean \
    && rm -rf /nodejs \
    && apt-get purge -y python3-pip wget make \
    && apt-get clean && rm -rf /var/lib/apt/lists/* 

RUN chmod +x ./docker-entrypoint.sh
EXPOSE 9000
ENTRYPOINT ["./docker-entrypoint.sh"]
