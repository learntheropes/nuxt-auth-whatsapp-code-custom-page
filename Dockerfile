
# Set the base image to Node 16
FROM node:16

# Update the repository sources list
RUN apt-get update && apt-get upgrade -y

# Install Chromium
RUN apt install chromium-browser

# Set the working directory to /app
WORKDIR /app

# Bundle your app source inside the docker image
COPY . .

# Install all the dependencies
RUN npm install

# Build the nuxt app
RUN npm run build

# Your app binds to port 8080 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 8080

# Set environment variable to disable Chromium's sandbox (this is required if you are running as root)
ENV CHROME_BIN=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_ARGS='--no-sandbox'

# Start command
CMD [ "node", ".output/server/index.mjs" ]