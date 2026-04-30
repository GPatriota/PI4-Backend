# API Usage Examples

Complete examples for all ElectroShop API endpoints with curl and JavaScript/TypeScript.

## Authentication

### Register

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "password123"
  }'
```

```typescript
// JavaScript/TypeScript
const response = await fetch('http://localhost:3000/api/v1/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'password123'
  })
});
const data = await response.json();
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

### Get Current User

```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Refresh Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN"}'
```

## Products

### List All Products

```bash
curl http://localhost:3000/api/v1/products
```

### Search Products

```bash
curl "http://localhost:3000/api/v1/products?search=iphone"
```

### Filter by Category

```bash
curl "http://localhost:3000/api/v1/products?category=1"
```

### Pagination

```bash
curl "http://localhost:3000/api/v1/products?page=1&limit=10"
```

### Get Product Details

```bash
curl http://localhost:3000/api/v1/products/1
```

### Create Product (Admin)

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "name": "iPhone 15 Pro",
    "description": "Latest iPhone with A17 Pro chip",
    "price": 9999.99,
    "stock": 50,
    "categoryId": 1,
    "imageUrl": "https://example.com/image.jpg"
  }'
```

### Update Product (Admin)

```bash
curl -X PATCH http://localhost:3000/api/v1/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "price": 8999.99,
    "stock": 45
  }'
```

## Categories

### List Categories

```bash
curl http://localhost:3000/api/v1/categories
```

## Cart

### Get Cart

```bash
curl http://localhost:3000/api/v1/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Add to Cart

```bash
curl -X POST http://localhost:3000/api/v1/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'
```

```typescript
// React Native example
const addToCart = async (productId: number, quantity: number) => {
  const token = await AsyncStorage.getItem('@electroshop_token');
  
  const response = await fetch('http://localhost:3000/api/v1/cart/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ productId, quantity })
  });
  
  return response.json();
};
```

### Update Cart Item

```bash
curl -X PATCH http://localhost:3000/api/v1/cart/items/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"quantity": 3}'
```

### Remove from Cart

```bash
curl -X DELETE http://localhost:3000/api/v1/cart/items/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Clear Cart

```bash
curl -X DELETE http://localhost:3000/api/v1/cart/clear \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Orders

### Checkout (Create Order)

```bash
curl -X POST http://localhost:3000/api/v1/orders/checkout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

```typescript
// Complete checkout flow
const checkout = async () => {
  const token = await AsyncStorage.getItem('@electroshop_token');
  
  try {
    const response = await fetch('http://localhost:3000/api/v1/orders/checkout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    const data = await response.json();
    return data.data.order;
  } catch (error) {
    console.error('Checkout failed:', error);
    throw error;
  }
};
```

### List Orders

```bash
curl http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Order Details

```bash
curl http://localhost:3000/api/v1/orders/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Order Status (Admin)

```bash
curl -X PATCH http://localhost:3000/api/v1/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"status": "CONFIRMED"}'
```

## Addresses

### List Addresses

```bash
curl http://localhost:3000/api/v1/addresses \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Address

```bash
curl -X POST http://localhost:3000/api/v1/addresses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "label": "Casa",
    "street": "Rua das Flores, 123",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567",
    "isDefault": true
  }'
```

### Update Address

```bash
curl -X PATCH http://localhost:3000/api/v1/addresses/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "street": "Rua das Rosas, 456"
  }'
```

### Set Default Address

```bash
curl -X PATCH http://localhost:3000/api/v1/addresses/1/set-default \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Delete Address

```bash
curl -X DELETE http://localhost:3000/api/v1/addresses/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Users

### Get User Profile

```bash
curl http://localhost:3000/api/v1/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update User

```bash
curl -X PATCH http://localhost:3000/api/v1/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "João Pedro Silva",
    "email": "joao.pedro@example.com"
  }'
```

### Update Accessibility Settings

```bash
curl -X PATCH http://localhost:3000/api/v1/users/1/accessibility \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "fontScale": 1.2,
    "highContrast": true,
    "largeButtons": false
  }'
```

## Complete E-commerce Flow Example

```typescript
// 1. Register or Login
const auth = await fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const { data: { accessToken, user } } = await auth.json();

// 2. Browse Products
const products = await fetch('http://localhost:3000/api/v1/products?category=1');
const { data: productList } = await products.json();

// 3. Add to Cart
await fetch('http://localhost:3000/api/v1/cart/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    productId: productList[0].id,
    quantity: 1
  })
});

// 4. View Cart
const cart = await fetch('http://localhost:3000/api/v1/cart', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
const { data: cartData } = await cart.json();

// 5. Checkout
const order = await fetch('http://localhost:3000/api/v1/orders/checkout', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
const { data: orderData } = await order.json();

// 6. View Order
const orderDetails = await fetch(
  `http://localhost:3000/api/v1/orders/${orderData.order.id}`,
  { headers: { 'Authorization': `Bearer ${accessToken}` } }
);
```

## Error Handling

All errors follow this format:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `500` - Internal Server Error

## Rate Limiting

For production, implement rate limiting:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/v1/', limiter);
```
