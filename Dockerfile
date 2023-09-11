FROM node:15 

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 8080

CMD ["nodemon", "src/main.ts"]