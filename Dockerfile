FROM node:15 

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install -g nodemon

COPY wait-for-it.sh /usr/wait-for-it.sh

RUN chmod +x /usr/wait-for-it.sh

COPY . .

EXPOSE 8080

CMD ["nodemon", "src/main.ts"]