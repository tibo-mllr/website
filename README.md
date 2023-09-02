# Personal website project

This is my personal website project. Might always be useful to have one. <br />
Familiarising more with ReactjS, NestJS, and learning to use MongoDB and Docker.

## Prerequisites

- NodeJS with yarn and lerna
- A MongoDB instance

## Run[^1]

- Copy the [`apps/back/.env.template`](apps/back/.env.template) file to `apps/back/.env` and complete it accordingly.
- Open a terminal and run the following commands:

  ```bash
  yarn install:ci
  yarn start
  ```

  The website will be available at [http://localhost:3000](http://localhost:3000).

  (Don't forget to stop the terminal with `Ctrl+C`, otherwise the ports may still be in use)

[^1]: A Docker version is coming soon.
