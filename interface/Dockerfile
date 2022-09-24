FROM node:18.9.0

COPY pages public styles components next.config.js package.json yarn.lock next-env.d.ts tsconfig.json /app/
WORKDIR /app/

RUN yarn install
