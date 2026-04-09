# ShopKart Project Summary

## 1. Overview
ShopKart is a full-stack e-commerce web application that combines a modern shopping experience with authentication, cart and wishlist management, checkout, order persistence, and AI-powered virtual try-on.

The project is designed as a single deployable service where the backend serves both API routes and frontend static assets.

## 2. Architecture
ShopKart follows a frontend + backend architecture:

- Frontend: HTML, CSS, and Vanilla JavaScript
- Backend: Node.js with Express
- Database: MongoDB with Mongoose
- Authentication: Firebase Google Sign-In
- AI Service: Replicate model `cuuupid/idm-vton`

High-level flow:
1. User interacts with frontend UI.
2. Frontend calls backend APIs under `/api/*`.
3. Backend reads/writes MongoDB as needed.
4. For virtual try-on, backend calls Replicate and returns generated image URL.

## 3. Core User Features

### Authentication
- Google login using Firebase Authentication
- Local demo login/signup support
- Guest access mode for browsing

### Shopping and Discovery
- Hero entry with two modes: Shop Now and Shop by Goal
- Product listing with category filtering
- Goal-based shopping journeys
- Search functionality
- Product detail modal with pricing and discount display

### Product Interaction
- Size selection for clothing items
- Add to cart and add to wishlist
- User-specific cart and wishlist data handling

### Cart and Checkout
- Cart quantity updates and item removal
- Multi-step checkout flow:
  1. Delivery address
  2. Payment method
  3. Review and place order
- Order confirmation and order tracking UI

### Orders and Returns
- Order creation and retrieval support
- Return policy and return request flow in UI

### Virtual Try-On (AI)
- User uploads a front-facing photo
- Frontend uploads image to a public URL host (ImgBB)
- Frontend sends `personImage` and `garmentImage` URLs to backend
- Backend invokes Replicate `cuuupid/idm-vton`
- Generated output image URL is shown in the UI

## 4. Backend API Summary
Base API path: `/api`

### Auth
- `POST /api/auth/login`
  - Creates or retrieves user based on Firebase UID

### Orders
- `POST /api/order/create`
  - Creates an order document
- `GET /api/order/user/:userId`
  - Returns all orders for a user

### Products
- `POST /api/product/add`
  - Adds a new product
- `GET /api/product/all`
  - Returns all products
- `GET /api/product/:id`
  - Returns one product by MongoDB ID

### Try-On
- `POST /api/tryon`
  - Input: `personImage`, `garmentImage` (public image URLs)
  - Output: generated try-on image URL

## 5. Data Models

### User
- `uid` (Firebase UID, unique)
- `name`
- `email` (unique)
- `photoURL`
- `createdAt`

### Product
- `title`
- `price`
- `description`
- `image`
- `category`
- `createdAt`

### Order
- `userId`
- `items`
- `totalAmount`
- `createdAt`

## 6. Configuration and Environment
Typical environment variables required for backend:
- `MONGO_URI`: MongoDB connection string
- `REPLICATE_API_TOKEN`: token for Replicate try-on model
- `PORT`: server port (optional in local, usually set by host in deployment)

Frontend runtime key:
- `IMGBB_API_KEY` in `script.js` for converting uploaded image to a public URL before AI inference

## 7. Deployment Readiness
The project includes deployment guidance and a Render configuration. The backend serves frontend files, simplifying deployment as a single service.

Common deployment platforms supported in project docs:
- Render
- Vercel
- Railway
- Heroku

## 8. Strengths
- End-to-end user flow from authentication to order placement
- Unified deployment model (frontend + backend)
- Firebase + MongoDB integration for practical full-stack architecture
- AI try-on feature integrated into product detail journey

## 9. Documentation Note (Implementation Check)
A quick consistency check should be done in the try-on backend route to ensure the try-on utility call matches its function signature exactly. This helps avoid runtime request failures in production.

## 10. Suggested Next Documentation Artifacts
For complete project documentation, add:
1. API contract section with request/response samples per endpoint
2. Sequence diagram for auth, checkout, and try-on flows
3. Error handling matrix (user-facing and API-level)
4. Security notes for token handling, input validation, and CORS policy
5. Production checklist with monitoring and rollback steps
