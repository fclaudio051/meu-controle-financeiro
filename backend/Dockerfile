# Usa Node.js
FROM node:20-alpine

# Cria diretório
WORKDIR /app

# Copia configs primeiro (cache melhor)
COPY package*.json tsconfig.json ./

# Instala dependências
RUN npm install

# Copia o resto do código
COPY . .

# Compila o TS
RUN npm run build

# Expõe a porta
EXPOSE 4000

# Comando inicial
CMD ["npm", "run", "start"]
