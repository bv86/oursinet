FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /usr/src/app
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=cms --legacy --prod /prod/strapi
RUN pnpm deploy --filter=frontend --legacy --prod /prod/next

FROM base AS strapi
COPY --from=build /prod/strapi /prod/strapi
COPY --from=build /usr/src/app/strapi/dist /prod/strapi/dist
WORKDIR /prod/strapi
EXPOSE 1337
CMD [ "pnpm", "start" ]

FROM base AS next
COPY --from=build /prod/next /prod/next
COPY --from=build /usr/src/app/next/.next /prod/next/.next
WORKDIR /prod/next
EXPOSE 3000
CMD [ "pnpm", "start" ]