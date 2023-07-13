
# Set the base image to Node 16
FROM node:16

# Update the repository sources list
RUN apt-get update && apt-get upgrade -y

# Install Chromium
RUN apt-get install -y chromium

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

# Add env variables
ARG NITRO_PRESET
ENV NITRO_PRESET=${NITRO_PRESET}

ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

ARG FAUNA_SECRET
ENV FAUNA_SECRET=${FAUNA_SECRET}

ARG AUTH_ORIGIN
ENV AUTH_ORIGIN=${AUTH_ORIGIN}

ARG MONGODB_URI
ENV MONGODB_URI=${MONGODB_URI}

ARG TELEGRAM_TOKEN
ENV TELEGRAM_TOKEN=${TELEGRAM_TOKEN}

ARG TELEGRAM_CHAT_ID
ENV TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}

# Start command
CMD [ "node", ".output/server/index.mjs" ]