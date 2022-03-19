# Use a lighter version of Node as a parent image
FROM mhart/alpine-node:latest
# Set the working directory to /api
WORKDIR /api
# copy package.json into the container at /api
COPY package*.json .
# install dependencies
RUN npm install
# Copy the current directory contents into the container at /api
COPY . .
EXPOSE 9000/tcp
# Run the app when the container launches
CMD ["node", "app.js"]
