FROM oven/bun:latest as release

WORKDIR /app

COPY package.json . 

RUN bun install --frozen-lockfile

COPY . .

CMD [ "bun", "run", "start" ]