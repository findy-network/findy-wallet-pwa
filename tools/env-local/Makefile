DC := docker-compose

init-store:
	mkdir -p .data
	mkdir -p .data/agent
	mkdir -p .data/auth
	mkdir -p .data/vault

pull-images:
	${DC} pull

pull-up: init-store pull-images copy-scripts up

clean: down
	${DC} rm
	rm -rf .data

copy-scripts:
	cp ../env-docker/set-env.sh ../../public/set-env.sh
	cp ../env-docker/set-env-cli.sh ../../public/set-env-cli.sh

up: init-store
	${DC} up

down:
	${DC} down
