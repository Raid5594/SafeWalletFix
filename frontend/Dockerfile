FROM node:10-alpine
ADD . /var/app
WORKDIR /var/app
RUN npm install
RUN npm run build
CMD npm run start
EXPOSE 3000