# Personal website project

This is my personal website project. Might always be useful to have one. <br />
Familiarising more with ReactjS, NestJS, and learning to use MongoDB and Docker.

## Run locally

### Prerequisites

- NodeJS
- A MongoDB instance

### Run

- Copy the [`back/.env.template`](back/.env.template) file to `back/.env` and complete it accordingly.
- Open two terminals and run the following commands:

  ```bash
  make clean-install-back
  make run-back
  ```

  and

  ```bash
  make clean-install-front
  make run-front
  ```

  The website will be available at [http://localhost:3000](http://localhost:3000).

  (Don't forget to stop both terminals with `Ctrl+C`, otherwise the ports may still be in use)
