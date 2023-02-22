FROM node:18.12.1-alpine as builder
WORKDIR /usr
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma
RUN ls -a
RUN npm install
RUN npm run build
EXPOSE 80
CMD ["npm","start"]
