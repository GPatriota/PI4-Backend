# Quick Start Guide

## Prerequisites Installation

### Windows

1. **Install Node.js 18+**
   - Download from https://nodejs.org/
   - Verify: `node --version`

2. **Install PostgreSQL**
   - Download from https://www.postgresql.org/download/windows/
   - During installation, remember your postgres password
   - Verify: `psql --version`

### macOS

```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node@18

# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15
```

### Linux (Ubuntu/Debian)

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Quick Setup

```bash
# 1. Navigate to project
cd electroshop-backend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Create PostgreSQL database
# Using psql:
psql -U postgres
CREATE DATABASE electroshop;
\q

# Update DATABASE_URL in .env with your postgres password:
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/electroshop"

# 5. Run migrations and seed
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# 6. Start the server
npm run dev
```

## Verify Installation

1. Server should start on http://localhost:3000
2. Visit http://localhost:3000/health - should return success
3. Visit http://localhost:3000/api-docs - Swagger UI should load

## Demo Accounts

After seeding, you can login with:

**Regular User:**
- Email: user@example.com
- Password: password123

**Admin User:**
- Email: admin@electroshop.com
- Password: admin123

## Test the API

```bash
# Register a new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get products
curl http://localhost:3000/api/v1/products

# Get categories
curl http://localhost:3000/api/v1/categories
```

## Next Steps

1. Read the full [README.md](README.md)
2. Explore API with Swagger UI at http://localhost:3000/api-docs
3. Test endpoints with your frontend application

## Common Issues

**Port 3000 already in use:**
```bash
# Change PORT in .env file
PORT=3001
```

**PostgreSQL connection failed:**
```bash
# Check if PostgreSQL is running
# Windows: Check Services
# macOS: brew services list
# Linux: sudo systemctl status postgresql

# Verify DATABASE_URL in .env matches your setup
```

**Prisma errors:**
```bash
# Regenerate Prisma client
npm run prisma:generate

# Reset database (deletes all data)
npx prisma migrate reset
```
