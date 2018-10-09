FROM node:carbon

# Creating app directory
WORKDIR /usr/src/server

# Install app dependencies
COPY package*.json ./

RUN npm install -g nodemon

COPY . .

EXPOSE 8080
CMD ["npm", "start"]