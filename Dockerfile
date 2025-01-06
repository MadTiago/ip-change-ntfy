FROM node:22.12-alpine
WORKDIR /app
COPY ./package.json .
COPY ./pnpm-lock.yaml .
RUN npm install -g pnpm
RUN pnpm install
COPY . ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node","main.js"]