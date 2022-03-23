# Use a lighter version of Node as a parent image
FROM redhat/ubi8:latest
# Set the working directory to /api
WORKDIR /api
# copy package.json into the container at /api
COPY package*.json .
# install dependencies
RUN apt install nodejs
RUN npm install
# Copy the current directory contents into the container at /api
COPY . .
EXPOSE 80
EXPOSE 443
# Add certbot PPA
RUN apt-get update 
RUN apt-get install software-properties-common
RUN add-apt-repository universe
RUN add-apt-repository ppa:certbot/certbot
RUN apt-get update
# Install certbot
RUN certbot certonly --standalone --agree-tos --renew-by-default --text --email sweng312022@gmail.com -d kanbanbackend-petrukhp-dev.apps.sandbox-m2.ll9k.p1.openshiftapps.com
# Run the app when the container launches
CMD ["node", "app.js"]
