# Antarctic map

## Development

1. Build images for development

Create `.env` file in project directory with content:

```bash
SOURCE_CODE_PATH=/path/to/your/code
```

Then build the images

```bash
~~./build postgis~~
./build frontend
./build backend
```

2. Start frontend container

```bash
./dev frontend
```

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
./dev runserver
```

## `.env`

* GEOSERVER_URL
* SOURCE_CODE_PATH
* ~~ANTARCTIC_MAP_DATABASE_PWD~~
* ~~ANTARCTIC_MAP_DATABASE_USER~~
* ~~ANTARCTIC_MAP_DATABASE_PORT~~
* ~~ANTARCTIC_MAP_DATABASE_HOST~~