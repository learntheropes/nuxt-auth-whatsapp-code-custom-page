
# Set the base image to Node 16
FROM node:16

# Update the repository sources list
RUN apt-get update && apt-get upgrade -y

# Install Chromium
RUN apt-get install -y chromium

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \

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
ENV AUTH_ORIGIN=${AUTH_ORIGIN}

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