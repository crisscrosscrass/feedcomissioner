FROM node:latest

# Create app directory
WORKDIR /var/www/html
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY src/package.json /var/www/html
RUN npm install

COPY src/ /var/www/html
# If you are building your code for productione
# RUN npm ci --only=production
# Bundle app source
COPY . .
EXPOSE 8060
CMD [ "node", "server.js" ]
# CMD ["forever", "start", "server.js" ]