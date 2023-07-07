# Back (un)installations
clean-install-back:
	npm ci --prefix back/

ifeq (install-back,$(firstword $(MAKECMDGOALS)))
  RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
endif
install-back:
	npm install $(RUN_ARGS) --prefix back/

ifeq (uninstall-back,$(firstword $(MAKECMDGOALS)))
  RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
endif
uninstall-back:
	npm uninstall $(RUN_ARGS) --prefix back/


# Front (un)installations
clean-install-front:
	npm ci --prefix front/

ifeq (install-front,$(firstword $(MAKECMDGOALS)))
  RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
endif
install-front:
	npm install $(RUN_ARGS) --prefix front/

ifeq (uninstall-front,$(firstword $(MAKECMDGOALS)))
  RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
endif
uninstall-front:
	npm uninstall $(RUN_ARGS) --prefix front/


# Run app locally
run-back:
	npm run start --prefix back/

run-back-dev:
	npm run start:dev --prefix back/

run-front:
	npm run start --prefix front/


# Run app in Docker
launch-docker:
	docker-compose up -d

stop-docker:
	docker-compose down