# https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact
ARG baseImage
FROM $baseImage

WORKDIR /app
COPY node_modules-ext-0 ./node_modules
COPY node_modules-ext-1 ./node_modules
COPY node_modules-ext-2 ./node_modules
COPY node_modules-ext-3 ./node_modules
COPY node_modules-ext-4 ./node_modules
COPY node_modules-ext-5 ./node_modules
COPY node_modules ./node_modules
COPY node_modules-ext-99 ./node_modules
COPY dist ./dist
COPY package.json README.md tsconfig.json tsconfig.cjs.json ./

EXPOSE 7001
HEALTHCHECK \
  --interval=5s \
  --retries=3 \
  --start-period=5s \
  --timeout=3s \
  CMD curl -fs http://localhost:7001/ping || exit 1

# CMD ["npm", "run", "start_docker", "--", "--workers=$cpus"]
CMD ["./node_modules/.bin/egg-scripts", "start", "--framework=@midwayjs/web", "--workers=$cpus"]

