FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /usr/src/app
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch
COPY . .
ARG STRAPI_BASE_URL
ENV STRAPI_BASE_URL=${STRAPI_BASE_URL:-https://strapi.oursi.net}
ARG WEBSITE_URL
ENV WEBSITE_URL=${WEBSITE_URL:-https://oursi.net}
RUN pnpm i && pnpm run -r build \
    && pnpm deploy --filter=cms --legacy --prod /prod/strapi

FROM base AS strapi
COPY --from=build /prod/strapi /prod/strapi
COPY --from=build /usr/src/app/strapi/dist /prod/strapi/dist
WORKDIR /prod/strapi
EXPOSE 1337
CMD [ "pnpm", "start" ]

FROM base AS next
COPY --from=build /usr/src/app/next/.next/standalone /prod/next
COPY --from=build /usr/src/app/next/.next/static /prod/next/next/.next/static
COPY --from=build /usr/src/app/next/public /prod/next/next/public
WORKDIR /prod/next
EXPOSE 3000
CMD [ "node", "next/server.js" ]