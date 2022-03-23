# Use a lighter version of Node as a parent image
FROM ubuntu:latest
# Set the working directory to /api
WORKDIR /api
# copy package.json into the container at /api
COPY package*.json .
# Copy the current directory contents into the container at /api
COPY . .
# Update package lists
RUN apt-get update 
# install dependencies
RUN apt install nodejs -y
RUN ln -s /usr/local/bin/node /usr/bin/node
RUN ln -s /usr/local/lib/node /usr/lib/node
RUN ln -s /usr/local/bin/npm /usr/bin/npm
RUN ln -s /usr/local/bin/node-waf /usr/bin/node-waf
RUN npm install
# Install certbot
RUN apt install python3 python3-venv libaugeas0
RUN python3 -m venv /opt/certbot/
RUN /opt/certbot/bin/pip install --upgrade pip
RUN /opt/certbot/bin/pip install certbot certbot-apache
RUN ln -s /opt/certbot/bin/certbot /usr/bin/certbot
# Run Certbot
RUN certbot certonly --standalone --agree-tos --renew-by-default --text --email sweng312022@gmail.com -d kanbanbackend-petrukhp-dev.apps.sandbox-m2.ll9k.p1.openshiftapps.com
# Run the app when the container launches
EXPOSE 80
EXPOSE 443
CMD ["node", "app.js"]