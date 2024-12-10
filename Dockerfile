From node:21-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=8000
EXPOSE $PORT
CMD ["npm", "start"]