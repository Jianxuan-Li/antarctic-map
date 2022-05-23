# Antarctic map

## Demo

[https://antarctic.freeyeti.net/](https://antarctic.freeyeti.net/)

## Technique

- Backend: Python Django + Django Rest Framework
- Frontend: React.js + Webpack with ES6
- Map: Geoserver + Openlayers + Mapnik
- Data processing: GDAL + NumPy
- Data infrastructure: Apache Spark + PostGIS
- DevOps: Docker + Kubernetes (Microk8s) + Gitlab CI/CD

## Development

### Prepare:

- clone code to your workspace
- install docker

### Developing:

1. Start frontend container

Run `./dev frontend` in project root.

Then, start webpack dev server in the contianer by `./dev start` (hot reload is availabled)

2. Start backend container in other terminal window (or tab) with:

`./dev backend`

And then start django service in the backend container

```bash
./dev run
```

Then access `http://localhost:8000` or `http://127.0.0.1:8000`

### Further:

#### Recycle container

Quit the containers, and run `./dev down` (only Unix/Linux).

#### Restart containers after system restarted

`./dev docker-restart` (only Unix/Linux)

## Unit test

(Run in backend container)

- Start a test: `coverage run --source='.' manage.py test geodata`
- coverage report: `coverage report`

## `.env`

- `GEOSERVER_URL=` e.g.: `https://yourdomain.com/geoserver/`
- `GIS_DATA_DIR=` path of your GIS data, contains `DEM`, `sea_ice`... for detail please check Data section below
- `ANTARCTIC_MAP_DATABASE_PWD=`
- `ANTARCTIC_MAP_DATABASE_USER=`
- `ANTARCTIC_MAP_DATABASE_PORT=`
- `ANTARCTIC_MAP_DATABASE_HOST=`
- `ANTARCTIC_MAP_DATABASE_NAME=`
- `ANTARCTIC_MAP_TEST_DATABASE_NAME=`

## Sea ice data ETL

In development environment, use `python3 manage.py sea_ice_etl 20200730` to download data by day

## GeoServer and Data

- [https://gitlab.com/FreeYeti/antarctic-geoserver](https://gitlab.com/FreeYeti/antarctic-geoserver)

## Development environment

- [https://gitlab.com/FreeYeti/dev-in-docker](https://gitlab.com/FreeYeti/dev-in-docker)


## Build envs

- `BACKEND_IMAGE=antarcticmap/backend`
- `FRONTEND_IMAGE=antarcticmap/frontend`