# Use official Node.js image to build the project
FROM node:18 as build

# Set working directory
WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package.json package-lock.json ./

# Copy package.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app
RUN npm run build

# Use Nginx to serve the built files
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
