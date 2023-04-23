FROM node:latest

WORKDIR /front

COPY ./package.json /front/package.json

RUN npm install

COPY . /front

EXPOSE 3000

CMD ["npm", "start"]