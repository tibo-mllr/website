# Personal website project

This is a small website project. <br />
I work alone on this project, and I use it to learn new technologies and to experiment with new ideas. <br >

## Technologies

For the front:

- [React](https://reactjs.org/)
- [Formik](https://formik.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- websockets
- notistack notifications
- redux

For the back:

- [Nest.js](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/)
- JWT authentication and roles

For the deployment:

- [Docker](https://www.docker.com/)

The project uses:

- [TypeScript](https://www.typescriptlang.org/)
- [Yarn](https://yarnpkg.com/)
- [Turbo](https://turbo.build/)

## Features

- [A blog](apps/front/src/home#readme)
- [An organization view](apps/front/src/organization#readme)
- [A project view](apps/front/src/project#readme)
- [A resume view](apps/front/src/resume#readme)
- [An admin view](apps/front/src/admin#readme)

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
