# Backend + MongoDB Integration - Complete Guide

## ✅ INTEGRATION STATUS: COMPLETE

Your ShopKart e-commerce project now has a fully functional **Node.js + Express + MongoDB** backend integrated with your Firebase frontend!

---

## 📁 ALL CREATED FILES

### Backend Files (NEW):

```
server/
├── .env                    ✅ MongoDB connection string & config
├── package.json            ✅ Dependencies & scripts
├── server.js               ✅ Main Express server with MongoDB connection
├── models/
│   ├── User.js            ✅ User schema (Firebase UID, email, name, photo)
│   ├── Order.js           ✅ Order schema (userId, items, totalAmount)
│   └── Product.js         ✅ Product schema (title, price, image, category)
└── routes/
    ├── auth.js            ✅ POST /auth/login (Google Sign-In)
    ├── order.js           ✅ POST /order/create, GET /order/user/:userId
    └── product.js         ✅ POST /product/add, GET /product/all, GET /product/:id
```

---

## 🔧 MODIFIED FILES

### Frontend Files (MODIFIED):

1. **`firebase-auth.js`** ✅
   - Added backend API integration
   - Sends user data to MongoDB after Google Sign-In
   - Works for both popup and redirect authentication methods

**Changes made:**
```javascript
// After successful Google Sign-In:
const response = await fetch('http://localhost:5000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL
  })
});
```

---

## 🚀 BACKEND SERVER STATUS

✅ **Server Running:** `http://localhost:5000`  
✅ **MongoDB Connected:** `mongodb+srv://...shopkart`  
✅ **CORS Enabled:** Frontend can access from any origin  
✅ **Dependencies Installed:** express, mongoose, cors, dotenv (121 packages)

**Console Output:**
```
🚀 Server running on http://localhost:5000
✅ MongoDB connected successfully
```

---

## 🔌 API ENDPOINTS

### 1. **Authentication**

**POST** `/auth/login`  
Creates or retrieves user from MongoDB

**Request:**
```json
{
  "uid": "firebase-uid-123",
  "name": "John Doe",
  "email": "john@example.com",
  "photoURL": "https://lh3.googleusercontent.com/..."
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "65abc123...",
    "uid": "firebase-uid-123",
    "name": "John Doe",
    "email": "john@example.com",
    "photoURL": "https://...",
    "createdAt": "2024-11-16T10:30:00.000Z"
  }
}
```

---

### 2. **Orders**

**POST** `/order/create`  
Create a new order

**Request:**
```json
{
  "userId": "firebase-uid-123",
  "items": [
    {
      "id": 1,
      "title": "Running Shoes",
      "price": 89.99,
      "quantity": 2
    }
  ],
  "totalAmount": 179.98
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "_id": "65abc456...",
    "userId": "firebase-uid-123",
    "items": [...],
    "totalAmount": 179.98,
    "createdAt": "2024-11-16T10:35:00.000Z"
  }
}
```

**GET** `/order/user/:userId`  
Get all orders for a specific user

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "65abc456...",
      "userId": "firebase-uid-123",
      "items": [...],
      "totalAmount": 179.98,
      "createdAt": "2024-11-16T10:35:00.000Z"
    }
  ]
}
```

---

### 3. **Products**

**POST** `/product/add`  
Add a new product

**Request:**
```json
{
  "title": "Running Shoes",
  "price": 89.99,
  "description": "Comfortable running shoes",
  "image": "https://example.com/shoe.jpg",
  "category": "Fitness"
}
```

**Response:**
```json
{
  "success": true,
  "product": {
    "_id": "65abc789...",
    "title": "Running Shoes",
    "price": 89.99,
    "description": "Comfortable running shoes",
    "image": "https://...",
    "category": "Fitness",
    "createdAt": "2024-11-16T10:40:00.000Z"
  }
}
```

**GET** `/product/all`  
Get all products

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "_id": "65abc789...",
      "title": "Running Shoes",
      "price": 89.99,
      ...
    }
  ]
}
```

**GET** `/product/:id`  
Get a specific product by ID

**Response:**
```json
{
  "success": true,
  "product": {
    "_id": "65abc789...",
    "title": "Running Shoes",
    ...
  }
}
```

---

## 🧪 TESTING THE INTEGRATION

### ✅ Test 1: Authentication (Automatic)

1. **Open your frontend:** `http://localhost:5500/index.html`
2. **Click "Shop Now"** → **"Continue with Google"**
3. **Sign in with Google**
4. **Check backend console** - you should see:
   ```
   ✅ New user created: your-email@gmail.com
   ```
   OR
   ```
   ✅ Existing user logged in: your-email@gmail.com
   ```

5. **Check browser console** (F12) - you should see:
   ```
   ✅ User saved to MongoDB: {uid: "...", email: "..."}
   ```

**What happens:**
- Firebase authenticates user
- `firebase-auth.js` automatically sends user data to `http://localhost:5000/auth/login`
- Backend creates/retrieves user in MongoDB
- User can now shop with persistent data!

---

### ✅ Test 2: Create Order (Manual Test)

Open a new terminal or use a tool like **Postman** or **Thunder Client**:

```bash
# Using PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/order/create" -Method POST -ContentType "application/json" -Body '{
  "userId": "test-uid-123",
  "items": [{"id": 1, "title": "Test Product", "price": 50, "quantity": 1}],
  "totalAmount": 50
}'
```

**Expected Response:**
```json
{
  "success": true,
  "order": {
    "_id": "65abc...",
    "userId": "test-uid-123",
    "items": [...],
    "totalAmount": 50
  }
}
```

---

### ✅ Test 3: Add Product (Manual Test)

```bash
# Using PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/product/add" -Method POST -ContentType "application/json" -Body '{
  "title": "Test Running Shoes",
  "price": 89.99,
  "description": "Great shoes for running",
  "image": "https://via.placeholder.com/300",
  "category": "Fitness"
}'
```

**Expected Response:**
```json
{
  "success": true,
  "product": {
    "_id": "65abc...",
    "title": "Test Running Shoes",
    ...
  }
}
```

---

### ✅ Test 4: Get All Products

```bash
# Using PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/product/all" -Method GET
```

**Expected Response:**
```json
{
  "success": true,
  "products": [...]
}
```

---

## 🔄 HOW FRONTEND → BACKEND WORKS

```
┌─────────────────────────────────────────────────────────────┐
│                    USER CLICKS                               │
│              "Continue with Google"                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Firebase Authentication                         │
│         (Google OAuth popup or redirect)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│               firebase-auth.js                               │
│   • Receives user object from Firebase                       │
│   • Extracts: uid, name, email, photoURL                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│          POST http://localhost:5000/auth/login               │
│          body: { uid, name, email, photoURL }                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│               Backend (routes/auth.js)                       │
│   • Receives request                                         │
│   • Checks if user exists in MongoDB (by uid)                │
│   • If new → creates user in MongoDB                         │
│   • If existing → returns user from MongoDB                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  MongoDB Database                            │
│   Collection: users                                          │
│   Document: {                                                │
│     uid: "firebase-uid-123",                                 │
│     name: "John Doe",                                        │
│     email: "john@example.com",                               │
│     photoURL: "https://...",                                 │
│     createdAt: ISODate("2024-11-16")                         │
│   }                                                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│               Response to Frontend                           │
│   { success: true, user: {...} }                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│            script.js (existing code)                         │
│   • Receives firebaseAuthSuccess event                       │
│   • Updates UI with user name & photo                        │
│   • Shows shopping section                                   │
│   • User can now shop!                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 MONGODB DATABASE STRUCTURE

### Database: `shopkart`

**Collections:**

1. **`users`** - Stores all authenticated users
   ```json
   {
     "_id": ObjectId("65abc123..."),
     "uid": "firebase-uid-123",
     "name": "John Doe",
     "email": "john@example.com",
     "photoURL": "https://lh3.googleusercontent.com/...",
     "createdAt": ISODate("2024-11-16T10:30:00.000Z")
   }
   ```

2. **`orders`** - Stores all orders
   ```json
   {
     "_id": ObjectId("65abc456..."),
     "userId": "firebase-uid-123",
     "items": [
       {
         "id": 1,
         "title": "Running Shoes",
         "price": 89.99,
         "quantity": 2
       }
     ],
     "totalAmount": 179.98,
     "createdAt": ISODate("2024-11-16T10:35:00.000Z")
   }
   ```

3. **`products`** - Stores all products
   ```json
   {
     "_id": ObjectId("65abc789..."),
     "title": "Running Shoes",
     "price": 89.99,
     "description": "Comfortable running shoes",
     "image": "https://example.com/shoe.jpg",
     "category": "Fitness",
     "createdAt": ISODate("2024-11-16T10:40:00.000Z")
   }
   ```

---

## 🛠️ RUNNING THE BACKEND

### Start Backend Server:

**Option 1: Using node directly (CURRENTLY RUNNING)**
```bash
cd "c:\Users\Pranavi\OneDrive\Desktop\DBMS\shop_kart\server"
node server.js
```

**Option 2: Using npm start**
```bash
cd server
npm start
```

**Option 3: With auto-restart (development mode)**
```bash
cd server
npm install -g nodemon
nodemon server.js
```

### Stop Backend Server:

Press `Ctrl + C` in the terminal where the server is running.

---

## 🌐 CONNECTING FRONTEND TO BACKEND

### ✅ Already Connected!

Your frontend (`firebase-auth.js`) is already configured to send login data to the backend. No additional changes needed!

### Future Integrations:

If you want to save **orders** or fetch **products** from MongoDB:

**Example: Save order to MongoDB after checkout**

Add this to your `script.js` checkout function:

```javascript
async function completeOrder(orderData) {
  try {
    const response = await fetch('http://localhost:5000/order/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.uid,
        items: cart,
        totalAmount: calculateTotal()
      })
    });
    
    const data = await response.json();
    if (data.success) {
      console.log('✅ Order saved to MongoDB:', data.order);
      // Show success message
    }
  } catch (err) {
    console.error('❌ Order save failed:', err);
  }
}
```

**Example: Load products from MongoDB**

```javascript
async function loadProductsFromDB() {
  try {
    const response = await fetch('http://localhost:5000/product/all');
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Products loaded from MongoDB:', data.products);
      // Display products in UI
      displayProducts(data.products);
    }
  } catch (err) {
    console.error('❌ Failed to load products:', err);
  }
}
```

---

## 📝 ENVIRONMENT VARIABLES

**File:** `server/.env`

```env
MONGO_URI="mongodb+srv://chindanoorpranavi_db_user:chikkis230409@cluster0.xj9evgj.mongodb.net/shopkart?retryWrites=true&w=majority"
PORT=5000
```

**⚠️ Security Note:**
- Never commit `.env` to Git
- Add `.env` to `.gitignore`
- For production, use environment variables in hosting platform

---

## 🔒 SECURITY CONSIDERATIONS

✅ **Implemented:**
- CORS enabled for cross-origin requests
- MongoDB connection string in environment variable
- Firebase handles authentication (secure)
- User UID from Firebase (trusted source)

⚠️ **Recommended for Production:**
- Add Firebase Admin SDK for token verification
- Implement rate limiting (express-rate-limit)
- Add input validation (express-validator)
- Use HTTPS in production
- Add authentication middleware to protect routes
- Hash sensitive data if needed

**Example: Token verification (optional for production)**
```javascript
// Install: npm install firebase-admin
const admin = require('firebase-admin');

async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

---

## 🎯 NEXT STEPS

### Recommended Enhancements:

1. **Save orders to MongoDB** ✨
   - Modify checkout function in `script.js`
   - Call `POST /order/create` after successful payment

2. **Load products from MongoDB** ✨
   - Populate products dynamically from database
   - Add admin panel to manage products

3. **User profile page** ✨
   - Fetch user data from MongoDB
   - Display order history using `GET /order/user/:userId`

4. **Search & filter products** ✨
   - Add query parameters to product routes
   - Implement pagination

5. **Admin dashboard** ✨
   - Create admin routes for managing products
   - Add authentication middleware

---

## 📞 TROUBLESHOOTING

### Problem: Backend not connecting

**Solution:**
```bash
# Check if server is running
# You should see: "🚀 Server running on http://localhost:5000"

# If not running, start it:
cd server
node server.js
```

### Problem: MongoDB connection failed

**Solution:**
- Check `.env` file has correct `MONGO_URI`
- Verify MongoDB Atlas allows connections from your IP
- Check network connection

### Problem: CORS error in browser

**Solution:**
- Backend already has CORS enabled
- Make sure backend is running on port 5000
- Check fetch URL is correct: `http://localhost:5000`

### Problem: User not saving to MongoDB

**Solution:**
- Open browser console (F12)
- Check for error messages
- Verify backend console shows: "✅ New user created"
- Make sure backend is running before logging in

---

## ✅ SUMMARY

**What was created:**
- ✅ 9 new backend files (server, models, routes, config)
- ✅ MongoDB integration with 3 collections (users, orders, products)
- ✅ REST API with 6 endpoints
- ✅ Frontend-backend connection in `firebase-auth.js`

**What was modified:**
- ✅ `firebase-auth.js` - Added backend API calls

**What was NOT modified:**
- ✅ All existing frontend code preserved
- ✅ `index.html` - unchanged
- ✅ `styles.css` - unchanged
- ✅ `script.js` - unchanged (only firebase-auth.js modified)

**Status:**
- ✅ Backend server running on `http://localhost:5000`
- ✅ MongoDB connected successfully
- ✅ Authentication automatically saves to MongoDB
- ✅ Ready for production enhancements!

---

**🎉 Your e-commerce platform is now full-stack!** 🎉

Frontend (HTML/CSS/JS) + Firebase Auth + Node.js Backend + MongoDB Database = Complete E-commerce Solution!
