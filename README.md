# Antarctic map

## Demo

[https://antarctic.freeyeti.net/](https://antarctic.freeyeti.net/)



## Technique

- Backend: Python Django + Django Rest Framework
- Frontend: React.js + Webpack with ES6
- Map: Geoserver + Openlayers + Mapnik
- Data processing: GDAL + NumPy
- Data infrastructure: Apache Spark + PostGIS
- DevOps: Docker + Docker Compose + Gitlab CI/CD

## Development

Prepare: 

* clone code to your workspace
* install docker

1. Build images for development

Create a host record in `/etc/hosts`, point docker host to antarctic-map-statics. 

On OSX/Linux: `127.0.0.1       antarctic-map-statics`

On Windows, find out your IP-address of the gateway of docker network, and point it to `antarctic-map-statics`, example: `192.168.99.100  antarctic-map-statics`

(Notice: this hostname is configured in `config/webpack.config.dev.js`)

Create `.env` file in project directory with content:

```bash
SOURCE_CODE_PATH=/path/to/your/code
GEOSERVER_URL=https://example.com/geoserver/
```

Then build the images

```bash
cd ./dev-in-docker
./build frontend
./build backend
./build postgis
```

2. Start PostGIS database development server

`./dev postgis`

3. Start frontend container

Run `./dev frontend` in project root.

Then, start webpack dev server in the contianer (hot reload is availabled)

```bash
yarn build
yarn start
```

4. Start backend container in other terminal window (or tab) and run `./dev backend`

Start django service in the backend container

```bash
pip3 install -r requirements.txt
python3 manage.py migrate
./dev runserver
```

Every time you update code from the code repository, don't forget execute `python3 manage.py migrate`

5. Recycle container

Quit the containers, and run `./dev down`.

6. Restart containers after system restarted

`./dev docker-restart`

## Unit test

* Start a test: `coverage run --source='.' manage.py test geodata`
* coverage report: `coverage report`

## `.env`

* `GEOSERVER_URL` e.g.: `=https://yourdomain.com/geoserver/`
* `SOURCE_CODE_PATH` for development only
* `GIS_DATA_DIR` path of your GIS data, contains `DEM`, `sea_ice`... for detail please check Data section below
* `ANTARCTIC_MAP_DATABASE_PWD`
* `ANTARCTIC_MAP_DATABASE_USER`
* `ANTARCTIC_MAP_DATABASE_PORT`
* `ANTARCTIC_MAP_DATABASE_HOST`
* `ANTARCTIC_MAP_DATABASE_NAME`
* `ANTARCTIC_MAP_TEST_DATABASE_NAME`

## Data

* [https://gitlab.com/FreeYeti/antarctic-data](https://gitlab.com/FreeYeti/antarctic-data)

## GeoServer

* [https://gitlab.com/FreeYeti/antarctic-geoserver](https://gitlab.com/FreeYeti/antarctic-geoserver)