FROM node

WORKDIR /mcontent

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3020

CMD ["node", "./index"]