FROM node

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
