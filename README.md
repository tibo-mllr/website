# Personal website project

This is my personal website project. Might always be useful to have one. <br />
Familiarising more with ReactjS, NestJS, and learning to use MongoDB and Docker.

## Run with Docker

- Copy the [`apps/back/.env.template`](apps/back/.env.template) file to `apps/back/.env` and complete it accordingly.
- Open a terminal and run `docker compose up -d`.

  After some building time, the application is avaiable at [http://localhost:3000](http://localhost:3000).

Once you're finished, don't forget to `docker compose down`.

## Run locally

### Prerequisites

- NodeJS (20.11.1)
- npm and yarn (1.22.21)
- A MongoDB instance (6.0.6)

- Copy the [`apps/back/.env.template`](apps/back/.env.template) file to `apps/back/.env` and complete it accordingly.
- Open a terminal and run the following commands:

  ```bash
  yarn install:ci
  yarn start
  ```

  The website will be available at [http://localhost:3000](http://localhost:3000).

One you're finished, don't forget to stop the terminal with `Ctrl+C` (otherwise the ports may still be in use).
