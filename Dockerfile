FROM node:18.12.1-alpine as builder
WORKDIR /usr
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma
RUN ls -a
RUN npm install
RUN npm run build
## this is stage two , where the app actually runs
FROM node:18.12.1-alpine
WORKDIR /usr
COPY package.json ./
RUN npm install --only=production
COPY --from=builder /usr/dist ./dist
EXPOSE 80
CMD ["npm","start"]