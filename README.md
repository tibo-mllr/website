# Personal website project

This is my personal website project. Might always be useful to have one. <br />
Familiarising more with ReactjS, NestJS, and learning to use MongoDB and Docker.

## Run with docker

### Prerequisites

- Docker

### Run

- Copy the [`back/.env.template`](back/.env.template) file to `back/.docker.env` and complete it accordingly.
- Open a terminal and run the following command:

```bash
docker-compose up
```

The website will be available at [http://localhost:3000](http://localhost:3000).

## Run locally

### Prerequisites

- NodeJS
- A MongoDB instance

### Run

- Copy the [`back/.env.template`](back/.env.template) file to `back/.env` and complete it accordingly.
- Open two terminals and run the following commands:

```bash
cd back
npm ci
npm run start
```

and

```bash
cd front
npm ci
npm run start
```

The website will be available at [http://localhost:3000](http://localhost:3000).
