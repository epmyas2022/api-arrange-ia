FROM node:22.21.1-alpine3.23 AS base

WORKDIR /app

RUN apk add --no-cache wget build-base && \
	wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -


ENV PATH="/root/.local/share/pnpm:$PATH"

FROM base AS install

WORKDIR /app

COPY package*.json ./

RUN pnpm install


FROM install AS build

WORKDIR /app


COPY . .

RUN npm run build

FROM build AS production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

ENV PORT=80

CMD ["node", "dist/main.js"]