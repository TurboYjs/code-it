#FROM node:18-alpine
#
## Set working directory
#WORKDIR /usr/app
#
## Install PM2 globally
##RUN npm install --global pm2
#
### Copy "package.json" and "package-lock.json" before other files
### Utilise Docker cache to save re-installing dependencies if unchanged
##COPY ./package*.json ./
##
### Install dependencies
##RUN npm install
#
## Copy all files
#COPY ./ ./
##RUN npm install -g nrm
##RUN nrm ls
##RUN nrm use cnpm
##17 0.357   npm ---------- https://registry.npmjs.org/
##17 0.358   yarn --------- https://registry.yarnpkg.com/
##17 0.358   tencent ------ https://mirrors.cloud.tencent.com/npm/
##17 0.358   cnpm --------- https://r.cnpmjs.org/
##17 0.358   taobao ------- https://registry.npmmirror.com/
##17 0.358   npmMirror ---- https://skimdb.npmjs.com/registry/
#RUN npm config set registry https://mirrors.cloud.tencent.com/npm/
## Install dependencies
#RUN npm install
## Build app
#RUN npm run build
#
## Expose the listening port
#EXPOSE 3000
#
## Run container as non-root (unprivileged) user
## The "node" user is provided in the Node.js Alpine base image
##USER node
##RUN chown -R $USER .next
## Launch app with PM2
##CMD [ "pm2-runtime", "start", "npm", "--", "start" ]
#CMD [ "npm", "start"]
#FROM node:18-alpine AS deps
#RUN apk add --no-cache libc6-compat
#WORKDIR /app
#
#COPY package.json package-lock.json ./
#RUN  npm install --production

# Dockerfile.prod

FROM node:18-alpine AS base

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY . .

RUN npm config set registry https://mirrors.cloud.tencent.com/npm/
RUN npm config get registry
RUN npm install
RUN npm run build
RUN chown 777 ./.next
EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "start"]
## Production image, copy all the files and run next
#FROM base AS runner
#WORKDIR /app
#
##ENV NODE_ENV production
## Uncomment the following line in case you want to disable telemetry during runtime.
## ENV NEXT_TELEMETRY_DISABLED 1
#
#RUN addgroup --system --gid 1001 nodejs
#RUN adduser --system --uid 1001 nextjs
#
#COPY --from=builder /app/public ./public
#
## Set the correct permission for prerender cache
#RUN mkdir .next
#RUN chown nextjs:nodejs .next
#
## Automatically leverage output traces to reduce image size
## https://nextjs.org/docs/advanced-features/output-file-tracing
#COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#
#USER nextjs
#
#EXPOSE 3000
#
#ENV PORT 3000
## set hostname to localhost
#ENV HOSTNAME "0.0.0.0"
#
#CMD ["node", "server.js"]
