FROM node:6.9.1-alpine

MAINTAINER Luke Moscrop <luke@moscrop.me>

#Force Docker not to cache our package.json changes
#ENV NPM_CONFIG_LOGLEVEL info
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

# Seperate our application logic
WORKDIR /opt/app
ADD . /opt/app

EXPOSE 3001
ENV PORT 3001

CMD ["npm", "run", "build"]
CMD ["npm", "start"]