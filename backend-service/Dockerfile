FROM node:lts-buster-slim
USER node
RUN mkdir /home/node/app/
WORKDIR /home/node/app
COPY package.json ./
RUN npm install && npm cache clean --force
RUN mkdir logs
COPY ./ ./
CMD [ "node", "src/index.js"]