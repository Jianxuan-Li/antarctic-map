# Antarctic map

## Demo

[https://antarctic.freeyeti.net/](https://antarctic.freeyeti.net/)

This demonstration is running on a VPS with 2 core and 4GB memory, map rendering speed is unsatisfactory.

## Technique

* Language: Python\Nodejs\HTML\CSS\SHELL
* Django \ Django Rest Framework
* React.js in ES6 with webpack
* Postgresql: Postgresql and PostGIS
* Geoserver
* Gitlab CI/CD
* Docker with docker-compose

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

4. Recycle container

Quit the containers, and run `./dev down`.

## `.env`

* GEOSERVER_URL
* SOURCE_CODE_PATH
* ANTARCTIC_MAP_DATABASE_PWD
* ANTARCTIC_MAP_DATABASE_USER
* ANTARCTIC_MAP_DATABASE_PORT
* ANTARCTIC_MAP_DATABASE_HOST
* ANTARCTIC_MAP_DATABASE_NAME