#Image
#FROM delian:latest
FROM debian:stretch-slim

#Création du dossier de l'application
WORKDIR /usr/src/app

# Installation de curl avec apt-get
RUN apt-get update \
&& apt-get install -y curl \
&& rm -rf /var/lib/apt/lists/*

# Installation de Node.js à partir du site officiel
RUN curl -LO "https://nodejs.org/dist/v11.9.0/node-v11.9.0-linux-x64.tar.gz" \
&& tar -xzf node-v11.9.0-linux-x64.tar.gz -C /usr/local --strip-components=1 \
&& rm node-v11.9.0-linux-x64.tar.gz

# Ajout du fichier de dépendances package.json
ADD package.json ./

# Installation des dépendances
RUN npm install

# Ajout des sources
ADD . .

#Installation MONGO DB
RUN apt-get update
RUN \
  echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' > /etc/apt/sources.list.d/mongodb.list && \
  apt-get update && \
  apt-get install -y --allow-unauthenticated mongodb-org && \
  rm -rf /var/lib/apt/lists/*

# Define mountable directories.
VOLUME ["/data/db"]

# Define default command.
EXPOSE 27017
CMD ["./mongo_script.sh", "&"]

# On expose le port 8080
EXPOSE 8080

# On lance le serveur quand on démarre le conteneur
CMD ["node", "server.js", "&"]