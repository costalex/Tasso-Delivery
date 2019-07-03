FROM node:8
ENV LANG C.UTF-8
WORKDIR /app
COPY . /app
RUN rm /etc/localtime ; ln -s /usr/share/zoneinfo/Europe/Paris /etc/localtime
RUN npm install
CMD ./node_modules/pm2/bin/pm2-runtime start --name tasso-delivery app.js
