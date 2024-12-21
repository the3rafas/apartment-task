# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/client

# Copy package.json and package-lock.json to the working directory
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install app dependencies
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm install sharp

# Copy source files excluding node_modules
COPY . .

EXPOSE 3000


CMD pnpm run dev
