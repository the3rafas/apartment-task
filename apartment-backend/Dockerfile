# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/api

# Copy package.json and package-lock.json to the working directory
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install app dependencies
RUN npm install -g pnpm
RUN pnpm install


# Copy all files from the current directory to the working directory
COPY . .

# Expose the port on which the app will run on
EXPOSE 3001

# Start the server using the production build
CMD ["pnpm", "start:dev"]
