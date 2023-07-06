FROM node:18.14.1

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 8000

CMD ["npm", "run", "start"]