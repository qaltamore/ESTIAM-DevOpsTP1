#Image
FROM debian:jessie

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

#Installation MYSQL SERVER
ENV ROOT_PASSWORD root
RUN echo "mysql-server mysql-server/root_password password $ROOT_PASSWORD" | debconf-set-selections \
&& echo "mysql-server mysql-server/root_password_again password $ROOT_PASSWORD" | debconf-set-selections

RUN apt-get update && apt-get install -y mysql-client \
&& apt-get install -y mysql-server

# On expose le port 8080
EXPOSE 8080

#Pour lancer mysql au démarrage (mais ça fonctionne pas)
#CMD /usr/bin/mysqld_safe
#CMD ["mysql", "start"]
#CMD service mysql start
#CMD ["mysqld"]
#CMD ["service", "mysql", "start"]

# On lance le serveur quand on démarre le conteneur
#CMD ["node", "server.js"]

#CMD find /var/lib/mysql -type f -exec touch {} \;&& /etc/init.d/mysql start / && node server.js
CMD find /var/lib/mysql -type f -exec touch {} \;&& /etc/init.d/mysql start / && mysql -u root -e "CREATE DATABASE numbers_db;USE numbers_db;CREATE TABLE numbers (id INT PRIMARY KEY AUTO_INCREMENT NOT NULL, name VARCHAR(20), compteur INT )" && node server.js
 