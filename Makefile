run-dev:
	docker-compose -f docker-compose.yaml -f docker-compose.override.yaml up

run-dev-rebuild:
	docker-compose -f docker-compose.yaml -f docker-compose.override.yaml --build up


run-prod:
	docker-compose -f docker-compose.yaml up


run-prod-rebuild:
	docker-compose -f docker-compose.yaml --build up
