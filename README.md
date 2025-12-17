# Limona Backend

Express API with MySQL database for Limona e-commerce platform.

## Features
- ✅ Admin authentication with JWT
- ✅ Product management (CRUD operations)
- ✅ User management
- ✅ MySQL database integration
- ✅ Role-based access control
- ✅ Password hashing with bcrypt
- ✅ CORS enabled

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and update with your MySQL credentials:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=limona
JWT_SECRET=your-secret-key
PORT=3000
```

### 3. Setup Database
1. Start MySQL (XAMPP/WAMP/MAMP)
2. Open phpMyAdmin: `http://localhost/phpmyadmin`
3. Run SQL from `database/schema.sql`

### 4. Create Admin User
```bash
node scripts/generate-admin-hash.js
```
Copy the generated SQL and run it in phpMyAdmin.

### 5. Start Server
```bash
npm start
```

Server will run on `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /health` - Check if API is running
- `GET /api/v1/users/db-check` - Test database connection

### Admin Authentication
- `POST /api/v1/admin/login` - Admin login
- `GET /api/v1/admin/profile` - Get admin profile (protected)
- `PUT /api/v1/admin/profile` - Update profile (protected)
- `POST /api/v1/admin/register` - Register new admin (super admin only)

### Products (Public)
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get product by ID
- `GET /api/v1/products/search?q=query` - Search products

### Products (Admin - Protected)
- `POST /api/v1/products` - Create product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product
- `PATCH /api/v1/products/:id/stock` - Update stock

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

Get token by logging in:
```bash
POST /api/v1/admin/login
{
  "email": "admin@limona.com",
  "password": "admin123"
}
```

## Database Schema

### Tables
- `admins` - Admin users with authentication
- `products` - Product catalog
- `orders` - Customer orders
- `order_items` - Order line items

See `database/schema.sql` for complete structure.

## Troubleshooting

### Database Connection Failed
- Ensure MySQL is running
- Verify credentials in `.env`
- Check database name exists
- Confirm port 3306 is correct

### Authentication Errors
- Verify JWT_SECRET is set in `.env`
- Check token hasn't expired (24h lifetime)
- Ensure admin user exists in database

## Development

```bash
# Start development server
npm start

# Generate admin password hash
node scripts/generate-admin-hash.js
```

## Documentation

- [Complete Setup Guide](../ADMIN_SETUP_GUIDE.md)
- [Quick Start](../QUICK_START.md)
- [Implementation Summary](../IMPLEMENTATION_SUMMARY.md)

## Security Notes

⚠️ **Before Production:**
1. Change JWT_SECRET to a strong random string
2. Update default admin credentials
3. Use HTTPS
4. Enable production CORS whitelist
5. Add rate limiting
6. Set up database backups

## Tech Stack
- Node.js + Express
- MySQL with mysql2
- JWT for authentication
- bcrypt for password hashing
- CORS for cross-origin requests

## License
Private - Limona E-commerce Platform
