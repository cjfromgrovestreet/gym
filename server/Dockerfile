FROM node:22-alpine

WORKDIR /app

LABEL name="Backend Server"

COPY package*.json ./
RUN npm install && npm install nodemon

COPY . .

EXPOSE 3000

CMD ["npm","start"]


