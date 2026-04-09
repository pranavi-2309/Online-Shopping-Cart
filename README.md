# ShopKart - E-commerce Website

A fully functional e-commerce website with modern features similar to Amazon, Flipkart, and Myntra.

## Features Implemented

### 1. **Hero Banner with Two Options**
- Shop Now - Direct shopping experience
- Shop by Goal - Lifestyle-based shopping

### 2. **Authentication System**
- Gmail-only sign-up/login (demo implementation)
- Guest access option
- User session management

### 3. **Product Display**
- **Featured Products Section**
  - Product grid with multiple categories
  - Filter by category (All, Clothing, Electronics, Accessories, Home)
  - Product cards with images, prices, and discounts
  
- **Shop by Lifestyle Goals**
  - Fitness & Active
  - Professional
  - Casual Comfort
  - Luxury Living

### 4. **Product Details**
- Individual product popup/modal
- **Size selection for clothing items only**
- Add to Cart and Add to Wishlist options
- Product images, descriptions, and pricing

### 5. **Shopping Cart**
- **User-specific carts** (separate for each user)
- **Time-based decreasing discount** - Discount reduces by 1% every 2 minutes
- Real-time discount timer display
- Quantity adjustment
- Remove items functionality
- Persistent storage (localStorage)

### 6. **Wishlist**
- Add products to wishlist
- Move to cart from wishlist
- User-specific storage

### 7. **Guest User Features**
- Browse products as guest
- Login prompt when trying to add to cart/wishlist
- Guest session management

### 8. **Checkout Process**
- **3-Step Checkout Flow:**
  1. **Delivery Address** - Complete address form
  2. **Payment Method** - Card, UPI, Net Banking, Cash on Delivery
  3. **Order Review** - Final review before placing order
  
- Order confirmation with order ID
- Success message popup

### 9. **Search & Navigation**
- Search functionality across products
- Category filtering
- Goal-based product filtering
- Responsive header with cart/wishlist counts

## How to Use

1. **Open the website** - See the hero banner with two options
2. **Choose Shopping Mode:**
   - Click "Shop Now" for featured products
   - Click "Shop by Goal" for lifestyle-based shopping
3. **Login/Guest Access:**
   - Sign in with Gmail (enter any @gmail.com email for demo)
   - Or continue as guest
4. **Browse Products:**
   - Filter by category
   - Search for specific items
   - Click on products to view details
5. **Add to Cart:**
   - Select size (for clothing)
   - Add to cart (requires login for guests)
   - Watch discount decrease over time
6. **Checkout:**
   - Review cart
   - Enter delivery address
   - Select payment method
   - Place order

## Key Features

✅ Gmail-only authentication  
✅ Guest access with login prompts  
✅ User-specific carts (no overlap)  
✅ Time-based decreasing discounts  
✅ Size selection for clothing  
✅ Wishlist functionality  
✅ Complete checkout flow  
✅ Address management  
✅ Multiple payment options  
✅ Order confirmation  
✅ Responsive design  
✅ Modern UI/UX  

## Technologies Used

- HTML5
- CSS3 (with modern animations)
- Vanilla JavaScript
- Font Awesome icons
- LocalStorage for data persistence

## AI Try-On Setup (Replicate)

1. Create a `.env` file in the project root using `.env.example` as reference.
2. Add your Replicate token:
   - `REPLICATE_API_TOKEN=your_token_here`
3. Optional: keep the model fixed to the purchased version:
   - `REPLICATE_MODEL_VERSION=cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985`
4. Start backend:
   - `cd server && npm install && npm run dev`

The try-on API endpoint is available at `/api/tryon` (also mounted at `/tryon`).

## Demo Notes

- Gmail authentication is simulated for demo purposes
- In production, integrate with Google OAuth 2.0
- Product images are from Unsplash
- Discount timer updates every minute
- All buttons are functional

## File Structure

```
shop_kart/
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Future Enhancements (as you mentioned)

You can let me know about any additional features you'd like:
- Order history
- Product reviews and ratings
- Advanced filtering options
- Payment gateway integration
- Real backend integration
- Email notifications
- And more...

Enjoy shopping with ShopKart! 🛒
