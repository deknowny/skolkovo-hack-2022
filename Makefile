run-dev:
	cd wavesexchange-testnet \
		&& docker-compose up -d \
		&& cd .. \
		&& docker-compose -f docker-compose.yaml -f docker-compose.override.yaml up

run-dev-rebuild:
	cd wavesexchange-testnet \
		&& docker-compose up -d \
		&& cd .. \
		&& docker-compose -f docker-compose.yaml -f docker-compose.override.yaml --build up


run-prod:
	cd wavesexchange-testnet \
		&& docker-compose up -d \
		&& cd .. \
		&& docker-compose -f docker-compose.yaml up


run-prod-rebuild:
	cd wavesexchange-testnet \
		&& docker-compose up -d \
		&& cd .. \
		&& docker-compose -f docker-compose.yaml --build up
