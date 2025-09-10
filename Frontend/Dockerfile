# Usa Node.js
FROM node:20-alpine

WORKDIR /app

# Copia configs primeiro
COPY package*.json tsconfig.json ./

RUN npm install

# Copia tudo
COPY . .

# Build da aplicação
RUN npm run build

# Expõe porta
EXPOSE 3000

# Comando inicial (Next.js em produção)
CMD ["npm", "run", "start"]
