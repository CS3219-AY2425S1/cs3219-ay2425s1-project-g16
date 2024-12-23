setup:
	./scripts/install-deps.sh
	./scripts/ensure-volume.sh

migrate-seed:
	./scripts/migrate-seed-databases.sh

db-up:
	./scripts/ensure-volume.sh
	docker compose --env-file .env.local -f docker-compose.local.yaml up -d

db-down:
	docker compose --env-file .env.local -f docker-compose.local.yaml down
	echo 'y' | docker volume prune

up:
	./scripts/ensure-volume.sh
	docker compose --env-file .env.local up -d

down:
	docker compose --env-file .env.local down
	echo 'y' | docker volume prune

k8s-up:
	./scripts/k8s-up.sh

k8s-down:
	./scripts/k8s-down.sh
