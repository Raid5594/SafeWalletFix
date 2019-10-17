FROM node:10-alpine
ADD . /var/app
WORKDIR /var/app
RUN npm install
RUN npm run build
CMD serve -s build -l 3000
EXPOSE 3000