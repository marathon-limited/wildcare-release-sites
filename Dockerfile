# --- deps stage: install all deps (incl. dev) needed to build ---
FROM node:20-alpine AS deps
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- builder stage: build the Next.js app and seed the database ---
FROM node:20-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm run seed

# --- runner stage: minimal production image ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache python3 make g++ \
  && addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy package files and install only production deps (better-sqlite3 needs a native rebuild here too)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force \
  && apk del python3 make g++

# Copy built app (no public/ dir in this project, so it's not copied)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/data ./data

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3111
CMD ["npm", "start"]
