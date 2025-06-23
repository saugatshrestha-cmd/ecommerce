# E-Commerce Website

A modern, responsive e-commerce platform built with MERN stack.

## 🚀 Features

- **User Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Role-based access control (Admin/Customer/Seller)

- **Product Management**
  - Product catalog with categories
  - Product search and filtering
  - Product details with image gallery
  - Inventory management

- **Shopping Experience**
  - Shopping cart functionality

- **Order Management**
  - Secure checkout process
  - Multiple payment options
  - Order tracking
  - Order history

- **Admin Panel**
  - Dashboard with analytics
  - Product management
  - Order management
  - User management
  - Sales reports

- **Seller Panel**
  - Dashboard with analytics
  - Product management (CRUD operations)
  - Order status management
  - Sales reports

## 🛠️ Tech Stack

**Frontend:**
- Framework - React.js
- Styling - Tailwind CSS

**Backend:**
- Runtime - Node.js
- Framework - Express.js
- Database - MongoDB

**Additional Tools:**
- Authentication - JWT
- Payment Gateway - Stripe
- File Storage - Cloudinary

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js
- MongoDb

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/saugatshrestha-cmd/ecommerce.git
   cd ecommerce
   ```

2. **Install dependencies:**
   ```bash
   # For backend
   cd backend
   npm install
   
   # For frontend
   cd frontend
   npm install
   ```

3. **Environment Variables:**
   Create `.env` files in both frontend and backend directories:
   
   **Backend (.env):**
   ```env
   NODE_ENV=development
   STORAGE_TYPE=MONGO
   DATABASE_URL=your_database_connection_string
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   EMAIL_FROM=noreply@myapp.com
   ETHEREAL_USER=your_ethereal_user
   ETHEREAL_PASSWORD=your_ethereal_password
   ETHEREAL_HOST=smtp.ethereal.email
   ETHEREAL_PORT=587
   ETHEREAL_SECURE=false
   FRONTEND_URL=
   ```

   **Frontend (.env):**
   ```env
   VITE_API_BASE_URL=
   ```


6. **Start the application:**
   ```bash
   # Start backend server
   cd backend
   npm run dev
   
   # Start frontend development server
   cd frontend
   npm run dev
   ```

## 📱 Usage

### For Customers:
1. Browse products by category or search
2. View product details and reviews
3. Add items to cart
4. Register/Login to your account
5. Proceed to secure checkout
6. Track your orders

### For Admins:
1. Login to admin panel
2. View and Delete products
3. View, cancel and delete orders
4. Manage user accounts
5. View sales analytics

### For Sellers:
1. Login to seller panel
2. Manage products (Add/Edit/Delete)
3. View and manage orders status
5. View sales analytics

## Some API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

