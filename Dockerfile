FROM node:latest

WORKDIR /app

COPY . /app

EXPOSE 8080

CMD ["npm", "start"]