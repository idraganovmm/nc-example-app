# nc-example-app

## Setup

### Prerequisites

#### Node and NPM via NVM

**Install NVM:**

Follow the instructions [here](https://github.com/nvm-sh/nvm#installing-and-updating).

**Install the version of node specified in the `.nvmrc` file and switch to it:**

```bash
nvm install
nvm use
```

**(Optional) Set the node version as default:**

```bash
nvm alias default $(cat .nvmrc)
```

**(Optional) Automatically switch Node version when changing directories:**

Follow the instructions for your shell [here](https://github.com/nvm-sh/nvm#deeper-shell-integration).


#### Docker
Follow the instructions [here](https://docs.docker.com/engine/install/).

**Post installation steps for Linux users:**

Follow the instructions [here](https://docs.docker.com/engine/install/linux-postinstall/).

**Docker Compose:**

In case `docker compose` isn't setup with the docker intallation follow the instructions [here](https://docs.docker.com/compose/install/).

### Clone the repo and cd into the folder

```bash
git clone git@github.com:<your-project>.git
cd <your-project>
```

### Install Node modules

```bash
npm install
```

### Setup environment variables

Copy the `.env.example` file to `.env`. Update environment variables as needed.

```bash
cp .env.example .env
```

### Setup environment variables for e2e tests

Copy the `.env` file to `.env.test`. Update environment variables as needed.

```bash
cp .env .env.test
```

Update `NODE_ENV` to `test`.

Make sure to provide a different `PGDATABASE` from what you have in `.env`
as e2e tests wipe the database clean before they run.

You may want to disable query logging by removing `DEBUG=knex:query`.

### (Optional) Setup docker-compose overrides

Create a `docker-compose.override.yml` file.

```bash
touch docker-compose.override.yml
```

Paste the following configuration into the file:

```bash
version: '3'

services:
  db:
    volumes:
      - /path/to/volume:/var/lib/postgresql/data
```

Update `/path/to/volume` with the directory you want to store the volumes into.

### Create the database

```bash
docker-compose up -d
```

### Run database migrations

```bash
npm run db:migrate:latest
```

## Running the app

```bash
# build the app
npm run build
# run in development mode
npm run start

# run in watch mode
npm run start:dev

# run in debug mode
npm run start:debug
```

## Test

**Unit Tests**

```bash
# run
npm run test

# watch
npm run test:watch

# coverage
npm run test:cov
```

**End-to-end Tests**

```bash
# e2e tests
npm run test:e2e

# e2e coverage
npm run test:e2e:cov
```


## Working with migrations

The underlying library is `knex`. You can find their guide on migraions [here](http://knexjs.org/guide/migrations.html).

```bash
# check what is the last applied migration
npm run db:migrate:version

# check which migrations have been run and how many are pending
npm run db:migrate:status

# create a new migration file
npm run db:migrate:make <migration-name>

# run the next migration that has not yet been run
npm run db:migrate:up

# undo the last migration that was run
npm run db:migrate:down

# run all pending migrations
npm run db:migrate:latest

# rollback the last batch of migrations
npm run db:migrate:rollback

# rollback all migrations
npm run db:migrate:rollback --all

# rollback all migrations and re-apply latest
npm run db:migrate:reset
```

To debug migrations set the `DEBUG` environment variable to `knex:query`, e.g.
```bash
DEBUG=knex:query npm run db:migrate:up
```

## Working with Docker

```bash
# build the image
npm run image:build

# run the image
npm run image:run
```

## Working with OpenAPI
  
```bash
# generate the openapi document (in the .openapi folder)
npm run openapi:g
  
# serve swagger ui with the generated openapi document
# note: supported is only 'linux/amd64' architecture
npm run openapi:serve
```

You can change the port SwaggerUI is being served on by modifying SWAGGER_UI_PORT environment variable in .env


## Debug

**VS Code**

Go to the Debug menu (CTRL+SHIFT+D). From `RUN AND DEBUG` at the top select `Run Script: Launch via NPM`.
You should now be able to start debugging by pressing `F5`.
