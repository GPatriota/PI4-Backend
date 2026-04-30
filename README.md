# ElectroShop Backend API

A complete RESTful API for an e-commerce electronics store built with Express.js, TypeScript, Prisma, and PostgreSQL.

## Features

- User authentication with JWT (access & refresh tokens)
- Role-based authorization (USER & ADMIN)
- Product management with search and filters
- Shopping cart functionality
- Order processing with stock management
- Address management
- Accessibility settings
- API documentation with Swagger/OpenAPI
- Input validation with Zod
- TypeScript for type safety
- Prisma ORM for database operations

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma 5
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 12 or higher
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd electroshop-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/electroshop"

# Server
PORT=3000
NODE_ENV=development

# JWT (generate strong secrets for production!)
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS (comma-separated list of allowed origins)
ALLOWED_ORIGINS=http://localhost:8081,exp://192.168.1.100:8081
```

### 4. Setup PostgreSQL database

Create a PostgreSQL database:

```bash
# Using psql
createdb electroshop

# Or via SQL
psql -U postgres
CREATE DATABASE electroshop;
```

### 5. Run database migrations

```bash
npm run prisma:migrate
```

### 6. Seed the database (optional)

Populate the database with demo data:

```bash
npm run prisma:seed
```

This creates:
- 2 demo users (user@example.com / password123, admin@electroshop.com / admin123)
- 3 categories (Celulares, Computadores, Notebooks)
- 8 sample products
- Sample addresses

## Running the Application

### Development mode

```bash
npm run dev
```

The server will start on `http://localhost:3000` with hot-reloading enabled.

### Production mode

```bash
# Build the project
npm run build

# Start the server
npm start
```

## API Documentation

Once the server is running, you can access:

- **Swagger UI**: http://localhost:3000/api-docs
- **API Spec (JSON)**: http://localhost:3000/api-docs.json
- **Health Check**: http://localhost:3000/health

## API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| POST | `/register` | Register new user | ❌ | ❌ |
| POST | `/login` | Login user | ❌ | ❌ |
| POST | `/refresh` | Refresh access token | ❌ | ❌ |
| GET | `/me` | Get current user | ✅ | ❌ |
| POST | `/logout` | Logout user | ✅ | ❌ |

### Users (`/api/v1/users`)

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| GET | `/:id` | Get user by ID | ✅ | ❌ |
| PATCH | `/:id` | Update user | ✅ | ❌ |
| DELETE | `/:id` | Delete user | ✅ | ❌ |
| PATCH | `/:id/accessibility` | Update accessibility settings | ✅ | ❌ |

### Products (`/api/v1/products`)

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| GET | `/` | List products | ❌ | ❌ |
| GET | `/:id` | Get product details | ❌ | ❌ |
| POST | `/` | Create product | ✅ | ✅ |
| PATCH | `/:id` | Update product | ✅ | ✅ |
| DELETE | `/:id` | Delete product | ✅ | ✅ |

**Query Parameters for `GET /products`:**
- `category` - Filter by category ID
- `search` - Search in name/description
- `active` - Filter active/inactive
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

### Categories (`/api/v1/categories`)

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| GET | `/` | List all categories | ❌ | ❌ |

### Cart (`/api/v1/cart`)

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| GET | `/` | Get user's cart | ✅ | ❌ |
| POST | `/items` | Add item to cart | ✅ | ❌ |
| PATCH | `/items/:id` | Update cart item | ✅ | ❌ |
| DELETE | `/items/:id` | Remove item | ✅ | ❌ |
| DELETE | `/clear` | Clear cart | ✅ | ❌ |

### Orders (`/api/v1/orders`)

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| GET | `/` | List user's orders | ✅ | ❌ |
| GET | `/:id` | Get order details | ✅ | ❌ |
| POST | `/checkout` | Create order from cart | ✅ | ❌ |
| PATCH | `/:id/status` | Update order status | ✅ | ✅ |

### Addresses (`/api/v1/addresses`)

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| GET | `/` | List addresses | ✅ | ❌ |
| POST | `/` | Create address | ✅ | ❌ |
| PATCH | `/:id` | Update address | ✅ | ❌ |
| DELETE | `/:id` | Delete address | ✅ | ❌ |
| PATCH | `/:id/set-default` | Set as default | ✅ | ❌ |

## Usage Examples

### Register a new user

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "password123"
  }'
```

Response includes `accessToken` and `refreshToken`.

### Get products

```bash
# Get all products
curl http://localhost:3000/api/v1/products

# Search products
curl "http://localhost:3000/api/v1/products?search=iphone"

# Filter by category
curl "http://localhost:3000/api/v1/products?category=1"

# With pagination
curl "http://localhost:3000/api/v1/products?page=1&limit=10"
```

### Add to cart (authenticated)

```bash
curl -X POST http://localhost:3000/api/v1/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'
```

### Checkout (create order)

```bash
curl -X POST http://localhost:3000/api/v1/orders/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Business Logic

### Shipping Calculation

- **Shipping Cost**: R$ 19.90
- **Free Shipping**: For orders with subtotal ≥ R$ 499.00

### Order Status Flow

```
PENDING → CONFIRMED → SHIPPED → DELIVERED
          ↓
       CANCELLED
```

- When an order is **CANCELLED**, product stock is restored

### Stock Management

- Stock is validated when adding to cart
- Stock is reduced when order is created
- Stock is restored when order is cancelled
- All operations use database transactions for consistency

### Admin Role Assignment

- Users with email containing "admin" are automatically assigned ADMIN role during registration

## Database Schema

### Main Tables

- **User**: User accounts with authentication
- **Category**: Product categories
- **Product**: Products with pricing and stock
- **CartItem**: Shopping cart items
- **Order**: Customer orders
- **OrderItem**: Order line items
- **Address**: User addresses
- **AccessibilitySettings**: User accessibility preferences

See `prisma/schema.prisma` for the complete schema.

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server with hot-reload

# Build
npm run build           # Compile TypeScript to JavaScript

# Production
npm start               # Start production server

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run database migrations
npm run prisma:seed     # Seed database with demo data
npm run prisma:studio   # Open Prisma Studio (database GUI)

# Testing
npm test                # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
```

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Prisma Studio

View and edit your database with a GUI:

```bash
npm run prisma:studio
```

Opens at http://localhost:5555

## Testing

Run the test suite:

```bash
npm test
```

Run with coverage:

```bash
npm run test:coverage
```

## Security Considerations

### Production Checklist

- [ ] Change all JWT secrets to strong random values
- [ ] Use HTTPS in production
- [ ] Set `NODE_ENV=production`
- [ ] Enable rate limiting
- [ ] Configure proper CORS origins
- [ ] Use environment variables for all secrets
- [ ] Enable database SSL connection
- [ ] Implement request logging
- [ ] Add monitoring and error tracking
- [ ] Regular security audits with `npm audit`

### Password Security

- Passwords are hashed with bcrypt (12 salt rounds)
- Minimum 8 characters with at least one number
- Never exposed in API responses

### JWT Security

- Short-lived access tokens (15 minutes)
- Longer-lived refresh tokens (7 days)
- Tokens must be stored securely on client-side

## Deployment

### Deploy to Railway

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Add PostgreSQL: `railway add postgresql`
5. Deploy: `railway up`
6. Set environment variables in Railway dashboard

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create electroshop-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_ACCESS_SECRET=your-secret
heroku config:set JWT_REFRESH_SECRET=your-secret

# Deploy
git push heroku main

# Run migrations
heroku run npm run prisma:migrate
```

## Troubleshooting

### Database connection issues

```bash
# Check if PostgreSQL is running
pg_isready

# Test connection
psql -U postgres
```

### Port already in use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Prisma client errors

```bash
# Regenerate Prisma client
npm run prisma:generate
```

## Project Structure

```
electroshop-backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Custom middleware
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   ├── validators/       # Zod schemas
│   ├── types/            # TypeScript types
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed.ts           # Seed script
│   └── migrations/       # Migration files
├── tests/                # Test files
├── dist/                 # Compiled JavaScript
└── package.json          # Dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

ISC

## Support

For support, email support@electroshop.com or open an issue in the repository.

---

**Built with ❤️ for ElectroShop**
