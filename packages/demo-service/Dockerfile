# https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact
ARG baseImage
FROM $baseImage

# RUN addgroup -g 1000 node && adduser -u 1000 -G node -s /bin/sh -D node 

WORKDIR /app
RUN chown node /app
COPY --chown=node node_modules-ext-0 ./node_modules
COPY --chown=node node_modules-ext-1 ./node_modules
COPY --chown=node node_modules-ext-2 ./node_modules
COPY --chown=node node_modules-ext-3 ./node_modules
COPY --chown=node node_modules-ext-4 ./node_modules
COPY --chown=node node_modules-ext-5 ./node_modules
COPY --chown=node node_modules ./node_modules
COPY --chown=node node_modules-ext-99 ./node_modules
COPY --chown=node dist ./dist
COPY --chown=node package.json README.md tsconfig.json tsconfig.cjs.json ./

EXPOSE 7001
HEALTHCHECK \
  --interval=5s \
  --retries=3 \
  --start-period=5s \
  --timeout=3s \
  CMD curl -fs http://localhost:7001/ping || exit 1

USER node
CMD ./node_modules/.bin/egg-scripts start --framework=@midwayjs/web --workers=$cpus

