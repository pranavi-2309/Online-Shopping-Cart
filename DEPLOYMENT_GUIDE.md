# ShopKart Deployment Guide

## 🚀 Your Full-Stack E-commerce Application

ShopKart is now a complete full-stack e-commerce application with:
- ✅ Frontend & Backend unified on single server
- ✅ Firebase Google Authentication
- ✅ MongoDB Database
- ✅ Shopping Cart & Wishlist
- ✅ Order Management with Returns
- ✅ Product Management
- ✅ User Address Management

---

## 📦 Project Structure

```
shop_kart/
├── index.html              # Main frontend file
├── styles.css              # Styling
├── script.js               # Frontend logic
├── firebase-auth.js        # Firebase authentication
├── server/
│   ├── server.js           # Express server (serves frontend + API)
│   ├── .env                # Environment variables
│   ├── package.json        # Dependencies
│   ├── models/             # MongoDB models
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   └── routes/             # API routes
│       ├── auth.js         # /api/auth/*
│       ├── product.js      # /api/product/*
│       └── order.js        # /api/order/*
```

---

## 🌐 Local Development

### Start the Server

```powershell
cd server
node server.js
```

### Access the Application

- **Website**: http://localhost:5000
- **API**: http://localhost:5000/api

---

## 🚢 Deployment Options

### Option 1: Deploy to Render (Recommended - Free Tier)

#### Prerequisites
1. Create account at [Render.com](https://render.com)
2. Push your code to GitHub

#### Steps

1. **Prepare for Deployment**
   
   Create `render.yaml` in project root:
   ```yaml
   services:
     - type: web
       name: shopkart
       env: node
       buildCommand: cd server && npm install
       startCommand: cd server && node server.js
       envVars:
         - key: MONGO_URI
           sync: false
         - key: PORT
           value: 10000
   ```

2. **Push to GitHub**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

3. **Deploy on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repo → Click "Connect"
   - Render auto-detects settings from `render.yaml`
   - Add Environment Variables:
     - `MONGO_URI`: Your MongoDB connection string
     - `PORT`: 10000 (auto-set)
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment

4. **Update Firebase Authorized Domains**
   - Copy your Render URL (e.g., `shopkart.onrender.com`)
   - Go to Firebase Console → Authentication → Settings → Authorized domains
   - Click "Add domain" → Paste your Render URL
   - Save

5. **Done!** Your app is live at `https://your-app.onrender.com`

---

### Option 2: Deploy to Vercel

1. **Install Vercel CLI**
   ```powershell
   npm install -g vercel
   ```

2. **Create vercel.json**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server/server.js"
       }
     ]
   }
   ```

3. **Deploy**
   ```powershell
   vercel
   ```

4. **Add Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `MONGO_URI`

5. **Update Firebase Authorized Domains** (same as Render step 4)

---

### Option 3: Deploy to Railway

1. **Create account at [Railway.app](https://railway.app)**

2. **Deploy**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects Node.js
   - Set environment variables:
     - `MONGO_URI`
   - Click "Deploy"

3. **Configure**
   - Go to Settings → Generate Domain
   - Copy your Railway URL

4. **Update Firebase Authorized Domains** (same as Render step 4)

---

### Option 4: Deploy to Heroku

1. **Install Heroku CLI**
   ```powershell
   npm install -g heroku
   ```

2. **Create Procfile**
   ```
   web: cd server && node server.js
   ```

3. **Deploy**
   ```powershell
   heroku login
   heroku create shopkart-app
   heroku config:set MONGO_URI="your-mongodb-uri"
   git push heroku main
   ```

4. **Update Firebase Authorized Domains**

---

## 🔒 Environment Variables

Required for deployment:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/shopkart` |
| `PORT` | Server port (auto-set by platforms) | `5000` or `10000` |

---

## 🔧 Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster is running (not local)
- [ ] `.env` file has valid `MONGO_URI`
- [ ] Firebase project is set up
- [ ] Firebase config is in `firebase-auth.js`
- [ ] Google Sign-in is enabled in Firebase
- [ ] Code is pushed to GitHub
- [ ] All dependencies are in `package.json`

---

## 📱 MongoDB Atlas Setup (Required for Deployment)

1. **Create Free Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up / Login
   - Create free M0 cluster

2. **Configure Access**
   - Database Access → Add user
   - Network Access → Add IP: `0.0.0.0/0` (allow all)

3. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your password
   - Add `/shopkart` before `?retryWrites`

4. **Update .env**
   ```
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/shopkart?retryWrites=true&w=majority
   ```

---

## 🔐 Firebase Setup for Production

1. **Add Production Domain**
   - Firebase Console → Authentication → Settings → Authorized domains
   - Add your deployment URL (without `https://`)
   - Examples:
     - `shopkart.onrender.com`
     - `shopkart.vercel.app`
     - `shopkart.railway.app`

2. **No Code Changes Needed!**
   - Firebase config is already in `firebase-auth.js`
   - It works on any domain you authorize

---

## 🎨 Features Ready for Production

### User Features
- ✅ Google Authentication via Firebase
- ✅ Guest user mode
- ✅ Shopping cart with live discount timer
- ✅ Wishlist functionality
- ✅ Multiple saved addresses
- ✅ Order placement and tracking
- ✅ Order returns with 7-day policy
- ✅ Product search and filtering
- ✅ Shop by lifestyle goals

### Admin Features (Can be added)
- Product management via `/api/product/add`
- Order management via MongoDB

### Technical Features
- ✅ RESTful API
- ✅ MongoDB integration
- ✅ CORS enabled
- ✅ Static file serving
- ✅ Environment variables
- ✅ Error handling

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login/signup

### Products
- `GET /api/product/all` - Get all products
- `POST /api/product/add` - Add new product

### Orders
- `POST /api/order/create` - Create new order
- `GET /api/order/user/:uid` - Get user orders

---

## 🧪 Testing Before Deployment

```powershell
# Test locally
cd server
node server.js

# Open browser to http://localhost:5000
# Test features:
# ✓ Google sign-in works
# ✓ Add items to cart
# ✓ Place an order
# ✓ Check MongoDB for saved data
```

---

## 🐛 Troubleshooting

### Issue: "Firebase authentication is loading"
**Solution**: Wait 2-3 seconds after page load. Firebase SDK needs to initialize.

### Issue: "Cannot connect to MongoDB"
**Solution**: 
- Check `MONGO_URI` in environment variables
- Ensure MongoDB Atlas allows all IPs (0.0.0.0/0)
- Verify username/password in connection string

### Issue: "Google sign-in fails on deployed site"
**Solution**: 
- Add your deployment domain to Firebase Authorized Domains
- Firebase Console → Authentication → Settings → Authorized domains

### Issue: "API calls return 404"
**Solution**: 
- Ensure API routes use `/api/` prefix
- Check `server.js` has correct route mounting

---

## 📈 Monitoring & Maintenance

### Logs
- **Render**: Dashboard → Logs tab
- **Vercel**: Dashboard → Deployments → View logs
- **Railway**: Dashboard → Deployments → Logs
- **Heroku**: `heroku logs --tail`

### Database
- Monitor MongoDB Atlas Dashboard
- Check storage usage
- Review slow queries

### Performance
- Use browser DevTools → Network tab
- Check API response times
- Monitor Firebase usage in Firebase Console

---

## 🎯 Next Steps After Deployment

1. **Test All Features**
   - Sign in with Google
   - Add products to cart
   - Complete an order
   - Test return functionality

2. **Add Products**
   - Use `/api/product/add` endpoint
   - Or connect to MongoDB and add directly

3. **Monitor**
   - Check logs regularly
   - Monitor Firebase usage
   - Track MongoDB storage

4. **Share**
   - Share your deployment URL
   - Add to portfolio
   - Get feedback!

---

## 💡 Tips

- **Free Tier Limits**: Most platforms sleep after 15 min inactivity
- **Cold Starts**: First request may be slow (10-30 seconds)
- **Custom Domain**: Most platforms support custom domains
- **SSL**: HTTPS is automatic on all platforms
- **Scaling**: Upgrade plans if you get traffic

---

## 🆘 Support

### Render
- [Documentation](https://render.com/docs)
- [Community Forum](https://community.render.com)

### Vercel
- [Documentation](https://vercel.com/docs)
- [Support](https://vercel.com/support)

### Railway
- [Documentation](https://docs.railway.app)
- [Discord](https://discord.gg/railway)

---

## ✅ Deployment Complete Checklist

- [ ] Server running locally without errors
- [ ] MongoDB connection working
- [ ] Firebase authentication working
- [ ] Code pushed to GitHub
- [ ] Deployment platform account created
- [ ] Environment variables configured
- [ ] Domain added to Firebase authorized domains
- [ ] First successful deployment
- [ ] All features tested on production
- [ ] Monitoring set up

---

**Congratulations! Your full-stack e-commerce website is ready for the world! 🎉**

For any issues, check the troubleshooting section or review platform-specific logs.
