init-store:
	mkdir -p .data
	mkdir -p .data/agent
	mkdir -p .data/auth
	mkdir -p .data/vault

pull-images:
	docker compose pull

pull-up: init-store pull-images up

clean: down
	docker compose rm
	rm -rf .data

up: init-store
	docker compose up

down:
	docker compose down
