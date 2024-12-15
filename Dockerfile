FROM node:20.17

RUN mkdir app

RUN apt-get update -y && apt-get upgrade -y

RUN apt-get install apt-utils -y
RUN apt-get install apt-transport-https ca-certificates -y 

# Install yarn from the local .tgz
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

# Install root node_modules using Yarn
ADD package.json /tmp/package.json
ADD yarn.lock /tmp/yarn.lock
RUN cd /tmp && $HOME/.yarn/bin/yarn install

COPY . /app
WORKDIR /app

RUN cp -a /tmp/node_modules /app/node_modules

ENV NODE_ENV=production

EXPOSE 3010

CMD [ "npm", "run", "start"]