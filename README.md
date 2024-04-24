# Personal website project

This is a small website project. <br />
I work alone on this project, and I use it to learn new technologies and to experiment with new ideas. <br >

## Technologies

For the front:

- [React](https://reactjs.org/) in [Next.js](https://nextjs.org/)
- [Formik](https://formik.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- Websockets
- [Notistack](https://notistack.com/) notifications
- [Redux](https://redux.js.org/)

For the back:

- [Nest.js](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/)
- JWT authentication and roles

For the deployment:

- [Docker](https://www.docker.com/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [GitHub Container Registry](https://docs.github.com/en/packages/guides/about-github-container-registry)

The project on its whole uses:

- [TypeScript](https://www.typescriptlang.org/)
- [Yarn](https://yarnpkg.com/)
- [Turbo](https://turbo.build/)

## Features

- [A blog](apps/front/app/home#readme)
- [An organization view](apps/front/app/organizations#readme)
- [A project view](apps/front/app/projects#readme)
- [A resume view](apps/front/app/resume#readme)
- [An admin view](apps/front/app/admin#readme)

## In progress...

- A contact form
- A light/dark mode
- Factorize more the edit/create modals
- Handle token expiration in the front (it can already expire in the back, so for the moment the user just gets errors and has to log out and in again)
- Any idea you may have!

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
