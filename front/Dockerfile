FROM node:19-alpine

WORKDIR /front

COPY ./static/ ./static

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5173

CMD [ "npm", "run", "dev" ]
