DC := docker-compose

init-store:
	mkdir -p .data
	mkdir -p .data/agent
	mkdir -p .data/auth
	mkdir -p .data/vault

pull-images:
	${DC} pull

pull-up: init-store pull-images up

clean: down
	${DC} rm
	rm -rf .data

up: init-store
	${DC} up

down:
	${DC} down
