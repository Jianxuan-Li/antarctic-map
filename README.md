# Antarctic map

## Demo

[https://antarctic.freeyeti.net/](https://antarctic.freeyeti.net/)

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
```

2. Start frontend container

Run `./dev frontend` in project root.

Then, start webpack dev server in the contianer (hot reload is availabled)

```bash
yarn build
yarn start
```

3. Start backend container

```bash
./dev backend
```

Start django service in container

```bash
pip3 install -r requirements.txt
./dev runserver
```

4. Recycle container

Quit the containers, and run `./dev down`.

## `.env`

* GEOSERVER_URL
* SOURCE_CODE_PATH
* ~~ANTARCTIC_MAP_DATABASE_PWD~~
* ~~ANTARCTIC_MAP_DATABASE_USER~~
* ~~ANTARCTIC_MAP_DATABASE_PORT~~
* ~~ANTARCTIC_MAP_DATABASE_HOST~~