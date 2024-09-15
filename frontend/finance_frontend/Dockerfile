# Build Stage
FROM node:20-alpine AS build_image
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


# Production Stage
FROM node:20-alpine AS production_stage 
WORKDIR /app
COPY --from=build_image /app/package*.json ./
COPY --from=build_image /app/.next ./.next
# COPY --from=BUILD_IMAGE /app/public ./public
COPY --from=build_image /app/node_modules ./node_modules
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]