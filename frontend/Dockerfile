FROM node:20

WORKDIR /app

# 🔥 Clean install (VERY IMPORTANT)
COPY package*.json ./
RUN rm -rf node_modules package-lock.json
RUN npm install

# Copy rest
COPY . .

# 🔥 Force rebuild native deps
RUN npm rebuild lightningcss

EXPOSE 3000

CMD ["npm", "run", "dev"]