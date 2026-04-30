# Docker Setup Instructions

## Issue
Due to Docker Desktop networking limitations on Windows, Prisma cannot connect from the host to the PostgreSQL container on port 5433.

## Solution Options

### Option 1: Run migrations from inside Docker container (Recommended)

1. **Exec into the PostgreSQL container:**
   ```bash
   docker exec -it electroshop-postgres psql -U electroshop -d electroshop
   ```

2. **Run the SQL manually** (copy the migration SQL from `prisma/migrations/` after generating it):
   Or we can generate the SQL and apply it.

### Option 2: Use Docker Compose Exec

Run Prisma commands from a temporary container:

```bash
docker run --rm \
  --network electroshop-backend_default \
  -v "%CD%":/app \
  -w /app \
  -e DATABASE_URL="postgresql://electroshop:electroshop_dev_password@electroshop-postgres:5432/electroshop" \
  node:20-alpine \
  sh -c "npm install && npx prisma migrate deploy"
```

### Option 3: Deploy to Production Database

Since the local development has networking issues, you can:
1. Deploy the application to a cloud service (Render, Railway, etc.)
2. Use their provided PostgreSQL database
3. Run migrations there

### Option 4: Use pgAdmin or DBeaver

1. Install [pgAdmin](https://www.pgadmin.org/) or [DBeaver](https://dbeaver.io/)
2. Connect to: `localhost:5433`, user: `electroshop`, password: `electroshop_dev_password`
3. Run the migration SQL manually

## Current Status

- ✅ Docker PostgreSQL container is running on port 5433
- ✅ Backend code is fully built and ready
- ❌ Cannot connect from Windows host to Docker container (Windows/Docker Desktop networking issue)
- ✅ Connections work from within Docker network

## Quick Test Server (Without Database)

If you want to test the server without database:
1. Comment out database-dependent routes
2. Run `npm run dev`
3. Access Swagger at http://localhost:3000/api-docs
