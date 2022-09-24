run-dev:
	cd wavesexchange-testnet \
		&& docker-compose up -d \
		&& cd .. \
		&& docker-compose -f docker-compose.yaml -f docker-compose.override.yaml

run-dev-rebuild:
	cd wavesexchange-testnet \
		&& docker-compose up -d \
		&& cd .. \
		&& docker-compose -f docker-compose.yaml -f docker-compose.override.yaml --build


run-prod:
	cd wavesexchange-testnet \
		&& docker-compose up -d \
		&& cd .. \
		&& docker-compose -f docker-compose.yaml


run-prod-rebuild:
	cd wavesexchange-testnet \
		&& docker-compose up -d \
		&& cd .. \
		&& docker-compose -f docker-compose.yaml --build
