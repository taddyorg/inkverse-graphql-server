FROM node:20.17

RUN mkdir app

RUN apt-get update -y && apt-get upgrade -y

RUN apt-get install apt-utils -y
RUN apt-get install apt-transport-https ca-certificates -y 

# Install yarn from the local .tgz
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

# Copy package files first for better layer caching
COPY package.json yarn.lock /app/
COPY src/public/package.json /app/src/public/
COPY src/shared/package.json /app/src/shared/

WORKDIR /app

# Install dependencies including workspace packages
RUN $HOME/.yarn/bin/yarn install

# Copy the rest of the application
COPY . /app

ENV NODE_ENV=production

EXPOSE 3010

CMD [ "npm", "run", "start"]