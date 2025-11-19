FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_API_BASE_URL=http://localhost:5001
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/package*.json ./
RUN npm install --omit=dev && npm install --global serve

COPY --from=build /app/dist ./dist

ARG VITE_API_BASE_URL=http://localhost:5001
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

EXPOSE 5173

CMD ["serve", "dist", "--listen", "5173", "--single"]

