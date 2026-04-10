FROM node:20-alpine

# Install curl for health-checks
RUN apk add --no-cache curl

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the backend source code
COPY . .

# Expose the API port
EXPOSE 5000

# Command to run the backend
CMD ["npm", "start"]
