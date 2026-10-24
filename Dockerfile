FROM node:20-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd client && npm install

# Copy source
COPY . .

# Build client
RUN npm run build

# Expose port
EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["npm", "start"]
