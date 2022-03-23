# Use a lighter version of Node as a parent image
FROM redhat/ubi8:latest
# Set the working directory to /api
WORKDIR /api
# copy package.json into the container at /api
COPY package*.json .
# install dependencies
RUN sudo apt install nodejs
RUN npm install
# Copy the current directory contents into the container at /api
COPY . .
EXPOSE 80
EXPOSE 443
# Add certbot PPA
RUN sudo apt-get update 
RUN sudo apt-get install software-properties-common
RUN sudo add-apt-repository universe
RUN sudo add-apt-repository ppa:certbot/certbot
RUN sudo apt-get update
# Install certbot
RUN sudo certbot certonly --standalone --agree-tos --renew-by-default --text --email sweng312022@gmail.com -d kanbanbackend-petrukhp-dev.apps.sandbox-m2.ll9k.p1.openshiftapps.com
# Run the app when the container launches
CMD ["node", "app.js"]
