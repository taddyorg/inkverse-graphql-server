# Inkverse Server setup instructions

This is the main server for Inkverse. It contains the GraphQL API.

## Steps to Setup

0. Basic setups
  - Have or Install node >= 20.
  - Install yarn (npm install -g yarn)
  - Download & install Docker for Mac: https://store.docker.com/editions/community/docker-ce-desktop-mac

1. Setup private keys + passwords

### Create .env file

- Create a new `.env` file in this project's root. 

Add these values to the `.env` file:

```
DATABASE_URL=
SENTRY_URL=
PUBLIC_JWT=
PRIVATE_JWT=
```

### For PUBLIC_JWT & PRIVATE_JWT

- run the following code to create `jwt.key` (Don't add passphrase when asked). This will create a private key for signing JWT tokens.
```
ssh-keygen -t rsa -b 4096 -m PEM -f jwt.key
```

- run the following code to generate a `jwt.key.pub`. This will create a public key for verifying JWT tokens.
```
openssl rsa -in jwt.key -pubout -outform PEM -out jwt.key.pub
```

Update the `.env` file with the following values (you will need to remove newlines and replace them with \n so that it all one string and in one line):
```
PUBLIC_JWT=
PRIVATE_JWT=
```

You can delete the `jwt.key` and `jwt.key.pub` files (after you've copied them to the `.env` file).

2. This project contains submodules (a different internal repo)

```
git submodule init
git submodule update
```

to check that it installed properly
```
cd shared
ls // make sure it has files/folders inside here
```

The shared module contains 3rd party packages for it to work. Install them by running the following command:

```
cd shared
yarn install
```

3. Setup databases

Inkverse's server requires the following databases:
- Postgres (main database)

We are going to use Docker to setup the databases

#### FYI - Docker Coles notes:
Docker has 2 main components: images & containers. A image is a definition of what you want to create and a container is an instance of the image.

**-e** flag: pass in this value as an environment variable when you create the container.  
**-v** flag: Volume mounting. ie) Maps the directory where it stores the db data in the container (/usr/share/elasticsearch/data) to a local directory of your choosing (~/esdata). You get 2 benefits with this: 1) If you ever create a new container in the future, you dont lose all the data you have created previously as the data keeps persisted in a folder on your local disk even if the container dies. 2) I can share my existing folder with you so that you have some starter data.  
**-p**: Maps the port in your container to your localhost port. ie) When you go to localhost:9200 you will see a success message for having a running elastic search db.

Some helpful docker commands:

**docker ps** - Lists all running containers  
**docker start <containerId>** - Starts a container, once you have it setup your containers you can start and stop them ex) after your computer restarts.  
**docker stop <containerId>** - Stops a container  
**docker ps -a** - Lists all containers, even stopped containers  
**docker run** - You only need to run the `docker run` command once to install the container. After you have run the docker run command, you can just start/stop the containers going forward. ie) dont recreate new containers, but start and stop your exisiting containers with the changes / saved data going forward.

### To setup Postgres

You need to think of a USERNAME, PASSWORD, and DB-NAME (any names you want). Pass it in as environment variables to the command below.

```
docker run --name inkverse-postgres -e POSTGRES_USER=USERNAME -e POSTGRES_PASSWORD=PASSWORD -e POSTGRES_DB=DB-NAME -d  -v ~/docker-vms/inkverse-postgresdata:/var/lib/postgresql/data -p "5432:5432" postgres:13.16
```

Update the `.env` file in the follow format:
```
DATABASE_URL=postgres://USERNAME:PASSWORD@localhost:5432/DB-NAME
```

4. To setup AWS SQS Queues locally

```
docker run -d --name inkverse-queues -p 4100:4100 admiralpiett/goaws
```

This is a local message queue system that micmics AWS SQS queues. We use queues to handle sending emails, push notifications, etc.

Everytime you restart the docker container (or your laptop) you will have to create the queues again and all messages in your queues will be deleted.

5. Install packages for this project

```
yarn install
```

6. Run database migrations

```
cd shared
yarn run migrate
```

You may run into an error where it says you cannot update a table because it has not been created yet. It is trying to run the migrations asyncronously. To fix this, run all the create table migrations first, then run the migrations again.

7. Run the server!

```
yarn run dev
```

8. Localhost vs inkverse.test

We use custom localhost (inkverse.test) vs localhost, the benefit is that you dont mix up cookies and other brower data between localhost projects.

To set it up, add this to your hosts file, by `sudo vim /etc/hosts` on Mac/Linux.

```
127.0.0.1               localhost
127.0.0.1               inkverse.test
127.0.0.1               us-east-1.goaws.com
```

(us-east-1.goaws.com is used by inkverse-queues, add that as well)

---

If you ever need to start the containers (after a computer restart)

```
docker start inkverse-postgres && docker start inkverse-queues
```

and if you ever need to stop the containers

```
docker stop inkverse-postgres && docker stop inkverse-queues
```