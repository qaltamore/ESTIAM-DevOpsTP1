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
ENV MYSQL_PWD qaltamore
RUN echo "mysql-server mysql-server/root_password password $MYSQL_PWD" | debconf-set-selections \
&& echo "mysql-server mysql-server/root_password_again password $MYSQL_PWD" | debconf-set-selections

RUN apt-get update \
&& apt-get install -y mysql-server \
&& apt-get install mysql-client

# On expose le port 8080
EXPOSE 8080

CMD find /var/lib/mysql -type f -exec touch {} \;&& /etc/init.d/mysql start / && mysql -u root -e "CREATE DATABASE numbers_db;USE numbers_db;CREATE TABLE numbers (id SERIAL, name VARCHAR(20) UNIQUE NOT NULL, value int(11) DEFAULT 0); INSERT INTO numbers(name) VALUES('defaultNumber');" \
&& node server.js
 