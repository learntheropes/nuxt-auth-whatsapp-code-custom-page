
# Set the base image to Node 16
FROM node:16

# Update the repository sources list
RUN apt-get update && apt-get upgrade -y

# Install Chromium
RUN apt-get install -y chromium

# Install dependencies
RUN apt-get install -y gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

# Set the working directory to /app
WORKDIR /app

# Bundle your app source inside the docker image
COPY . .

# Set environment variable to disable Chromium's sandbox (this is required if you are running as root)
ENV PUPPETEER_EXECUTABLE_PATH='/usr/bin/chromium'
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
ENV AUTH_ORIGIN=${NEXTAUTH_URL}

ARG NEXTAUTH_URL
ENV NEXTAUTH_URL=${NEXTAUTH_URL}

ARG MONGODB_URI
ENV MONGODB_URI=${MONGODB_URI}

ARG TELEGRAM_TOKEN
ENV TELEGRAM_TOKEN=${TELEGRAM_TOKEN}

ARG TELEGRAM_CHAT_ID
ENV TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}

# Install all the dependencies
RUN npm install

# Build the nuxt app
RUN npm run build

# Your app binds to port 8080 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 8080

# Start command
CMD [ "node", ".output/server/index.mjs" ]