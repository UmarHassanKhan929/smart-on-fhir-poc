# One image for all three services (same deps) — compose overrides the command.
FROM node:24-slim

WORKDIR /app

RUN npm install -g pnpm@11.28.5

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY packages ./packages
COPY scripts ./scripts

# Default: the FHIR server. Compose overrides per service.
CMD ["npx", "tsx", "packages/fhir-server/server.ts"]
