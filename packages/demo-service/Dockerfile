# https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact
ARG baseImage
FROM $baseImage

WORKDIR /app
COPY node_modules ./node_modules
COPY dist ./dist
COPY node_modules-ext ./node_modules
COPY package.json README.md ./

EXPOSE 7001
HEALTHCHECK \
  --interval=10s \
  --retries=3 \
  --start-period=5s \
  --timeout=3s \
  CMD curl -fs http://localhost:7001/ping || exit 1

CMD ["npm", "run", "start_docker"]

