FROM node:18-alpine AS base

RUN apk add --no-cache libc6-compat

RUN npm i -g pnpm




FROM base AS dependencies

WORKDIR /app

COPY package.json  ./ 

RUN pnpm install 


FROM base AS build 

WORKDIR /app

COPY . .

COPY --from=dependencies /app/node_modules ./node_modules


RUN pnpm build


RUN pnpm prune --prod

FROM base AS deploy

WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /app/public ./public

COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json



USER nextjs

EXPOSE 3000

CMD ["pnpm", "start" ]

