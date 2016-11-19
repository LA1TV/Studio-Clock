FROM node:6.9.1-alpine
MAINTAINER Luke Moscrop <luke@moscrop.me>

RUN mkdir /app
WORKDIR /app

ADD package.json /app/
RUN npm install -q
RUN npm install gulp -g -q

ADD . /app

ENV PORT 3001
EXPOSE $PORT

RUN gulp build
CMD ["npm", "start"]