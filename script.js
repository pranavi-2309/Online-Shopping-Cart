// ========== Firebase Integration ==========
// Firebase authentication is handled in firebase-auth.js module
// Listen for Firebase auth events
const TRYON_API_URL = "/tryon";
const API_BASE = "/api";

window.addEventListener('firebaseAuthSuccess', (event) => {
    const user = event.detail;
    handleFirebaseLogin(user);
});

window.addEventListener('firebaseAuthSignOut', () => {
    handleFirebaseLogout();
});

window.addEventListener('firebaseAuthStateChanged', (event) => {
    const { user, isSignedIn } = event.detail;
    if (isSignedIn && user) {
        // Auto-login if user was previously signed in
        if (!currentUser) {
            handleFirebaseLogin(user);
        }
    }
});

// ========== State Management ==========
let currentUser = null;
let isGuest = false;
let shopMode = null; // 'shop-now' or 'shop-by-goal'
let selectedGoal = null;
let currentProduct = null;
let selectedSize = null;
let userOrders = {}; // Store user orders
let currentReturnOrder = null;
let userAddresses = {}; // Store user addresses
let selectedAddress = null; // Track selected address for checkout
let selectedDeliveryDate = null;
let tryOnImageData = null;
let tryOnPublicImageUrl = null;
let tryOnGeneratedImageUrl = null;
let tryOnGarmentReferenceData = null;

// Sample Products Data
const products = [
    // Clothing
    {
        id: 1,
        name: "Premium Cotton T-Shirt",
        category: "clothing",
        price: 1299,
        originalPrice: 1999,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        description: "Soft, breathable cotton t-shirt perfect for everyday wear. Made from 100% organic cotton.",
        goals: ["casual", "fitness"],
        discount: 35
    },
    {
        id: 2,
        name: "Formal Business Suit",
        category: "clothing",
        price: 8999,
        originalPrice: 12999,
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400",
        description: "Elegant business suit with modern fit. Perfect for professional settings.",
        goals: ["professional"],
        discount: 30
    },
    {
        id: 3,
        name: "Sports Running Shoes",
        category: "clothing",
        subcategory: "shoes",
        price: 3499,
        originalPrice: 4999,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        description: "Lightweight running shoes with superior cushioning and support.",
        goals: ["fitness"],
        discount: 30
    },
    {
        id: 4,
        name: "Designer Casual Jacket",
        category: "clothing",
        price: 4599,
        originalPrice: 6999,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
        description: "Stylish casual jacket for all seasons. Premium quality fabric.",
        goals: ["casual", "professional"],
        discount: 34
    },
    // Electronics
    {
        id: 5,
        name: "Wireless Headphones",
        category: "electronics",
        price: 5999,
        originalPrice: 8999,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
        goals: ["professional", "casual"],
        discount: 33
    },
    {
        id: 6,
        name: "Smart Watch",
        category: "electronics",
        price: 12999,
        originalPrice: 18999,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        description: "Feature-rich smartwatch with fitness tracking and health monitoring.",
        goals: ["fitness", "professional"],
        discount: 31
    },
    {
        id: 7,
        name: "Bluetooth Speaker",
        category: "electronics",
        price: 3999,
        originalPrice: 5999,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
        description: "Portable bluetooth speaker with crystal clear sound quality.",
        goals: ["casual", "luxury"],
        discount: 33
    },
    // Accessories
    {
        id: 8,
        name: "Leather Wallet",
        category: "accessories",
        price: 1999,
        originalPrice: 2999,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400",
        description: "Genuine leather wallet with multiple card slots and cash compartment.",
        goals: ["professional", "luxury"],
        discount: 33
    },
    {
        id: 9,
        name: "Designer Sunglasses",
        category: "accessories",
        price: 2499,
        originalPrice: 3999,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
        description: "UV protection sunglasses with polarized lenses.",
        goals: ["casual", "luxury"],
        discount: 37
    },
    {
        id: 10,
        name: "Gym Bag",
        category: "accessories",
        price: 1899,
        originalPrice: 2899,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        description: "Spacious gym bag with multiple compartments.",
        goals: ["fitness"],
        discount: 34
    },
    // Home & Living
    {
        id: 11,
        name: "Luxury Scented Candles",
        category: "home",
        price: 899,
        originalPrice: 1499,
        image: "https://images.unsplash.com/photo-1602874801006-94c0fb80e837?w=400",
        description: "Premium scented candles for home ambiance.",
        goals: ["luxury", "casual"],
        discount: 40
    },
    {
        id: 12,
        name: "Modern Desk Lamp",
        category: "home",
        price: 2299,
        originalPrice: 3499,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
        description: "Adjustable LED desk lamp with touch controls.",
        goals: ["professional"],
        discount: 34
    },
    {
        id: 13,
        name: "Classic Casual Top",
        category: "clothing",
        price: 699,
        originalPrice: 999,
        image: "/server/girl1.jpg",
        description: "Comfortable casual top with soft fabric and everyday fit.",
        goals: ["casual", "professional"],
        discount: 30
    },
    {
        id: 14,
        name: "Elegant Daily Wear",
        category: "clothing",
        price: 699,
        originalPrice: 999,
        image: "/server/girl2.jpg",
        description: "Lightweight daily wear outfit with a clean and modern look.",
        goals: ["casual", "luxury"],
        discount: 30
    }
];

// User carts (user email -> cart data)
const userCarts = {};
const userWishlists = {};

// ========== Initialization ==========
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('shopkart_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        loadUserData();
    }
    
    // Load guest cart if exists
    const guestCart = localStorage.getItem('shopkart_guest_cart');
    if (guestCart) {
        userCarts['guest'] = JSON.parse(guestCart);
    }
}

// ========== Event Listeners ==========
function setupEventListeners() {
    // Hero buttons
    document.getElementById('shop-now-btn').addEventListener('click', () => {
        shopMode = 'shop-now';
        showAuthModal();
    });
    
    document.getElementById('shop-by-goal-btn').addEventListener('click', () => {
        shopMode = 'shop-by-goal';
        showAuthModal();
    });
    
    // Auth modal - tabs
    document.getElementById('login-tab').addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
        document.getElementById('login-tab').classList.add('active');
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('signup-form').classList.add('hidden');
    });
    
    document.getElementById('signup-tab').addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
        document.getElementById('signup-tab').classList.add('active');
        document.getElementById('signup-form').classList.remove('hidden');
        document.getElementById('login-form').classList.add('hidden');
    });
    
    // Auth forms
    document.getElementById('login-form-inputs').addEventListener('submit', handleLogin);
    document.getElementById('signup-form-inputs').addEventListener('submit', handleSignup);
    document.getElementById('google-signin-btn').addEventListener('click', handleGoogleSignIn);
    document.getElementById('google-signup-btn').addEventListener('click', handleGoogleSignIn);
    document.getElementById('guest-access-btn').addEventListener('click', handleGuestAccess);
    
    // Navigation
    document.getElementById('nav-featured').addEventListener('click', (e) => {
        e.preventDefault();
        showFeaturedProducts();
    });
    
    document.getElementById('nav-goals').addEventListener('click', (e) => {
        e.preventDefault();
        showGoalsSection();
    });
    
    // Header actions
    document.getElementById('wishlist-btn').addEventListener('click', toggleWishlist);
    document.getElementById('cart-btn').addEventListener('click', toggleCart);
    document.getElementById('user-profile-btn').addEventListener('click', showUserProfile);
    document.getElementById('orders-btn').addEventListener('click', showOrdersModal);
    
    // Search
    document.getElementById('search-input').addEventListener('input', handleSearch);
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts(btn.dataset.category);
        });
    });
    
    // Goal cards
    document.querySelectorAll('.goal-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.goal-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedGoal = card.dataset.goal;
            loadGoalProducts(selectedGoal);
        });
    });
    
    // Back to goals button
    document.getElementById('back-to-goals-btn').addEventListener('click', () => {
        // Hide featured section and show goals section
        document.getElementById('featured-section').classList.add('hidden');
        document.getElementById('goals-section').classList.remove('hidden');
        
        // Hide back button
        document.getElementById('back-to-goals-btn').classList.add('hidden');
        
        // Reset selected goal
        document.querySelectorAll('.goal-card').forEach(c => c.classList.remove('active'));
    });
    
    // Cart sidebar
    document.getElementById('close-cart').addEventListener('click', () => {
        document.getElementById('cart-sidebar').classList.remove('active');
    });
    
    document.getElementById('close-wishlist').addEventListener('click', () => {
        document.getElementById('wishlist-sidebar').classList.remove('active');
    });
    
    document.getElementById('proceed-checkout').addEventListener('click', proceedToCheckout);
    
    // Address management
    document.getElementById('show-new-address-btn').addEventListener('click', () => {
        document.getElementById('saved-addresses-container').classList.add('hidden');
        document.getElementById('new-address-form-container').classList.remove('hidden');
        document.getElementById('cancel-new-address').classList.remove('hidden');
    });
    
    document.getElementById('cancel-new-address').addEventListener('click', () => {
        document.getElementById('new-address-form-container').classList.add('hidden');
        document.getElementById('saved-addresses-container').classList.remove('hidden');
    });
    
    // Checkout steps
    document.getElementById('continue-payment').addEventListener('click', continueToPayment);
    document.getElementById('back-to-address').addEventListener('click', backToAddress);
    document.getElementById('continue-review').addEventListener('click', continueToReview);
    document.getElementById('back-to-payment').addEventListener('click', backToPayment);
    document.getElementById('place-order').addEventListener('click', placeOrder);
    
    // Order success
    document.getElementById('continue-shopping').addEventListener('click', () => {
        closeModal('order-success-modal');
        showFeaturedProducts();
    });
    
    document.getElementById('view-return-policy').addEventListener('click', () => {
        document.getElementById('return-policy-modal').classList.add('active');
    });
    
    // Return request form
    document.getElementById('return-form').addEventListener('submit', submitReturnRequest);
    
    // Product detail modal
    document.getElementById('add-to-cart-detail').addEventListener('click', addToCartFromDetail);
    document.getElementById('add-to-wishlist-detail').addEventListener('click', addToWishlistFromDetail);
    document.getElementById('try-on-detail').addEventListener('click', openTryOnModal);
    document.getElementById('try-on-upload').addEventListener('change', handleTryOnUpload);
    document.getElementById('overlay-opacity').addEventListener('input', updateTryOnOpacity);
    document.getElementById('clear-try-on').addEventListener('click', clearTryOnImage);
    document.getElementById('generate-tryon').addEventListener('click', handleGenerateTryOn);
    
    // Size selection
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedSize = btn.dataset.size;
        });
    });
    
    // Login from guest modal
    document.getElementById('login-from-guest').addEventListener('click', () => {
        closeModal('login-required-modal');
        showAuthModal();
    });
    
    // Close modals
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal && modal.id === 'try-on-modal') {
                clearTryOnImage();
            }
            modal.classList.remove('active');
        });
    });
    
    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (modal.id === 'try-on-modal') {
                    clearTryOnImage();
                }
                modal.classList.remove('active');
            }
        });
    });
}

// ========== Authentication ==========
function showAuthModal() {
    const modal = document.getElementById('auth-modal');
    modal.classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Check if email exists in localStorage (simple demo auth)
    const savedUser = localStorage.getItem(`user_${email}`);
    
    if (savedUser) {
        const userData = JSON.parse(savedUser);
        if (userData.password === password) {
            currentUser = userData;
            isGuest = false;
            localStorage.setItem('shopkart_user', JSON.stringify(currentUser));
            
            loadUserData();
            closeModal('auth-modal');
            enterShoppingSection();
            showNotification('Welcome back, ' + currentUser.name + '!');
        } else {
            alert('Incorrect password');
        }
    } else {
        alert('Account not found. Please sign up first.');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    if (!name || !email || !phone || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (!email.includes('@gmail.com')) {
        alert('Please use a Gmail address');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    // Check if user already exists
    const existingUser = localStorage.getItem(`user_${email}`);
    if (existingUser) {
        alert('An account with this email already exists. Please login.');
        return;
    }
    
    // Create new user
    currentUser = {
        name: name,
        email: email,
        phone: phone,
        password: password,
        picture: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name)
    };
    
    // Save user data
    localStorage.setItem(`user_${email}`, JSON.stringify(currentUser));
    localStorage.setItem('shopkart_user', JSON.stringify(currentUser));
    
    // Initialize cart and wishlist
    userCarts[currentUser.email] = [];
    userWishlists[currentUser.email] = [];
    
    isGuest = false;
    closeModal('auth-modal');
    enterShoppingSection();
    showNotification('Account created successfully! Welcome, ' + name + '!');
}

// ========== Firebase Auth Handlers ==========
function handleFirebaseLogin(user) {
    currentUser = {
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        picture: user.photoURL,
        uid: user.uid,
        provider: 'google'
    };
    
    // Save to localStorage
    isGuest = false;
    localStorage.setItem('shopkart_user', JSON.stringify(currentUser));
    localStorage.setItem(`user_${user.email}`, JSON.stringify(currentUser));
    
    // Initialize user cart and wishlist
    if (!userCarts[currentUser.email]) {
        userCarts[currentUser.email] = [];
    }
    if (!userWishlists[currentUser.email]) {
        userWishlists[currentUser.email] = [];
    }
    if (!userAddresses[currentUser.email]) {
        userAddresses[currentUser.email] = [];
    }
    if (!userOrders[currentUser.email]) {
        userOrders[currentUser.email] = [];
    }
    
    loadUserData();
    closeModal('auth-modal');
    enterShoppingSection();
    showNotification('Welcome, ' + currentUser.name + '!');
}

function handleFirebaseLogout() {
    currentUser = null;
    isGuest = false;
    localStorage.removeItem('shopkart_user');
    
    // Reload page to reset state
    location.reload();
}

// Old Google Sign-In function (now handled by firebase-auth.js)
function handleGoogleSignIn() {
    // This function is kept for compatibility but actual sign-in
    // is now handled by the Firebase module (firebase-auth.js)
    if (window.loginWithGoogle) {
        window.loginWithGoogle();
    } else {
        alert('Firebase authentication is loading. Please try again in a moment.');
    }
}

function handleGuestAccess() {
    isGuest = true;
    currentUser = null;
    
    // Initialize guest cart if doesn't exist
    if (!userCarts['guest']) {
        userCarts['guest'] = [];
    }
    if (!userWishlists['guest']) {
        userWishlists['guest'] = [];
    }
    
    closeModal('auth-modal');
    enterShoppingSection();
}

function enterShoppingSection() {
    document.getElementById('hero-section').classList.add('hidden');
    document.getElementById('shopping-section').classList.remove('hidden');
    
    if (shopMode === 'shop-now') {
        showFeaturedProducts();
    } else if (shopMode === 'shop-by-goal') {
        showGoalsSection();
    }
    
    updateCartCount();
    updateWishlistCount();
}

function loadUserData() {
    // Load user's cart, wishlist, orders, and addresses from server/localStorage
    if (currentUser) {
        const savedCart = localStorage.getItem(`cart_${currentUser.email}`);
        const savedWishlist = localStorage.getItem(`wishlist_${currentUser.email}`);
        const savedOrders = localStorage.getItem(`orders_${currentUser.email}`);
        const savedAddresses = localStorage.getItem(`addresses_${currentUser.email}`);
        
        if (savedCart) {
            userCarts[currentUser.email] = JSON.parse(savedCart);
        }
        if (savedWishlist) {
            userWishlists[currentUser.email] = JSON.parse(savedWishlist);
        }
        if (savedOrders) {
            userOrders[currentUser.email] = JSON.parse(savedOrders);
        }
        if (savedAddresses) {
            userAddresses[currentUser.email] = JSON.parse(savedAddresses);
        }

        // Sync latest orders from backend when available.
        syncOrdersFromBackend();
    }
}

async function syncOrdersFromBackend() {
    if (!currentUser) return;

    const userId = currentUser.uid || currentUser.email;
    if (!userId) return;

    try {
        const response = await fetch(`${API_BASE}/order/user/${encodeURIComponent(userId)}`);
        if (!response.ok) return;

        const data = await response.json();
        if (!data.success || !Array.isArray(data.orders)) return;

        const userKey = getUserKey();
        userOrders[userKey] = data.orders
            .map((order) => ({
                ...order,
                date: order.date || order.createdAt
            }))
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        localStorage.setItem(`orders_${userKey}`, JSON.stringify(userOrders[userKey]));
    } catch (err) {
        console.warn('Could not sync orders from backend:', err.message || err);
    }
}

function getUserKey() {
    return isGuest ? 'guest' : currentUser?.email;
}

// ========== Product Display ==========
function showFeaturedProducts() {
    document.getElementById('featured-section').classList.remove('hidden');
    document.getElementById('goals-section').classList.add('hidden');
    loadProducts();
}

function showGoalsSection() {
    document.getElementById('featured-section').classList.add('hidden');
    document.getElementById('goals-section').classList.remove('hidden');
}

function loadProducts(filteredProducts = products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

function loadGoalProducts(goal) {
    // Hide goals section and show featured section with filtered products
    document.getElementById('goals-section').classList.add('hidden');
    document.getElementById('featured-section').classList.remove('hidden');
    
    // Show back button and hide category filters
    document.getElementById('back-to-goals-btn').classList.remove('hidden');
    document.getElementById('category-filters').classList.add('hidden');
    
    const filteredProducts = products.filter(p => p.goals.includes(goal));
    
    // Update page title
    const goalNames = {
        'fitness': 'Fitness & Active',
        'professional': 'Professional',
        'casual': 'Casual Comfort',
        'luxury': 'Luxury Living'
    };
    document.querySelector('#featured-section .section-title').textContent = goalNames[goal] + ' Products';
    
    // Load filtered products
    loadProducts(filteredProducts);
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <span class="product-badge">${product.discount}% OFF</span>
        <div class="product-body">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-category">${product.category}</p>
            <div class="product-price-row">
                <span class="product-price">₹${product.price}</span>
                <span class="product-original-price">₹${product.originalPrice}</span>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="showProductDetail(${product.id})">
                    <i class="fas fa-eye"></i> View
                </button>
            </div>
        </div>
    `;
    return card;
}

function filterProducts(category) {
    if (category === 'all') {
        loadProducts();
    } else {
        const filtered = products.filter(p => p.category === category);
        loadProducts(filtered);
    }
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    loadProducts(filtered);
}

function canUseTryOn(product) {
    return !!product && product.category === 'clothing' && product.subcategory !== 'shoes';
}

// ========== Product Detail Modal ==========
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    selectedSize = null;
    
    document.getElementById('product-detail-image').src = product.image;
    document.getElementById('product-detail-name').textContent = product.name;
    document.getElementById('product-detail-price').textContent = `₹${product.price}`;
    document.getElementById('product-detail-original-price').textContent = `₹${product.originalPrice}`;
    document.getElementById('product-detail-description').textContent = product.description;
    
    // Show size selection for clothing and shoes
    const sizeSelection = document.getElementById('size-selection');
    const clothingSizes = document.getElementById('clothing-sizes');
    const shoeSizes = document.getElementById('shoe-sizes');
    const tryOnBtn = document.getElementById('try-on-detail');
    
    if (product.category === 'clothing') {
        sizeSelection.classList.remove('hidden');
        
        if (product.subcategory === 'shoes') {
            // Show shoe sizes
            clothingSizes.classList.add('hidden');
            shoeSizes.classList.remove('hidden');
        } else {
            // Show clothing sizes
            clothingSizes.classList.remove('hidden');
            shoeSizes.classList.add('hidden');
        }
        
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
    } else {
        sizeSelection.classList.add('hidden');
    }

    if (tryOnBtn) {
        const enabled = canUseTryOn(product);
        tryOnBtn.disabled = !enabled;
        tryOnBtn.title = enabled
            ? 'Try this outfit on your photo'
            : 'Try-On is available for upper-body clothing only';
    }
    
    document.getElementById('product-modal').classList.add('active');
}

function addToCartFromDetail() {
    if (!currentProduct) return;
    
    // Check if user is guest and trying to add to cart
    if (isGuest) {
        showLoginRequiredModal();
        return;
    }
    
    // Check if clothing and size not selected
    if (currentProduct.category === 'clothing' && !selectedSize) {
        alert('Please select a size');
        return;
    }
    
    addToCart(currentProduct, selectedSize);
    closeModal('product-modal');
}

function addToWishlistFromDetail() {
    if (!currentProduct) return;
    
    // Check if user is guest
    if (isGuest) {
        showLoginRequiredModal();
        return;
    }
    
    addToWishlist(currentProduct);
    closeModal('product-modal');
}

function openTryOnModal() {
    if (!currentProduct) return;

    if (!canUseTryOn(currentProduct)) {
        alert('Try-On is currently available for upper-body clothing only.');
        return;
    }

    const productImage = document.getElementById('try-on-product-image');
    const productName = document.getElementById('try-on-product-name');
    const userImage = document.getElementById('try-on-user-image');
    const placeholder = document.getElementById('try-on-placeholder');
    const opacitySlider = document.getElementById('overlay-opacity');
    const uploadInput = document.getElementById('try-on-upload');

    // Open try-on with a clean state for the selected product.
    tryOnImageData = null;
    tryOnPublicImageUrl = null;
    tryOnGeneratedImageUrl = null;
    tryOnGarmentReferenceData = null;
    if (uploadInput) uploadInput.value = '';
    userImage.src = '';
    userImage.classList.add('hidden');
    placeholder.classList.remove('hidden');

    productImage.src = currentProduct.image;
    productName.textContent = `${currentProduct.name} try-on preview`;
    opacitySlider.value = '0';
    productImage.style.opacity = '0';
    setTryOnStatus('', 'info');

    closeModal('product-modal');

    document.getElementById('try-on-modal').classList.add('active');
}

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read uploaded image'));
        reader.readAsDataURL(file);
    });
}

function loadImageFromDataUrl(dataUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to process uploaded image'));
        img.src = dataUrl;
    });
}

function loadImageFromUrl(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load product image for try-on'));
        img.src = url;
    });
}

async function buildGarmentReferenceImage(product) {
    if (!product?.image) {
        throw new Error('Product image is missing');
    }

    if (tryOnGarmentReferenceData) {
        return tryOnGarmentReferenceData;
    }

    try {
        const img = await loadImageFromUrl(product.image);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return product.image;
        }

        // Crop central torso region to produce a cleaner garment reference.
        const sx = Math.round(img.naturalWidth * 0.15);
        const sy = Math.round(img.naturalHeight * 0.10);
        const sw = Math.round(img.naturalWidth * 0.70);
        const sh = Math.round(img.naturalHeight * 0.75);

        canvas.width = sw;
        canvas.height = sh;
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

        tryOnGarmentReferenceData = canvas.toDataURL('image/jpeg', 0.9);
        return tryOnGarmentReferenceData;
    } catch {
        // If browser blocks canvas export due CORS, fallback to original URL.
        return product.image;
    }
}

async function optimizeTryOnImage(file) {
    if (!file || !file.type.startsWith('image/')) {
        throw new Error('Please upload a valid image file');
    }

    const originalDataUrl = await readFileAsDataUrl(file);

    // Keep small images as-is to avoid unnecessary processing.
    if (file.size <= 800 * 1024) {
        return originalDataUrl;
    }

    const image = await loadImageFromDataUrl(originalDataUrl);
    const maxDimension = 1024;
    const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
    const scale = Math.min(1, maxDimension / longestSide);

    const scaledWidth = Math.max(1, Math.round(image.naturalWidth * scale));
    const scaledHeight = Math.max(1, Math.round(image.naturalHeight * scale));
    const squareSide = Math.max(scaledWidth, scaledHeight);

    // Pad to square to reduce head/feet cropping in model output.
    const canvas = document.createElement('canvas');
    canvas.width = squareSide;
    canvas.height = squareSide;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return originalDataUrl;
    }

    ctx.fillStyle = '#f2f4f8';
    ctx.fillRect(0, 0, squareSide, squareSide);

    const dx = Math.floor((squareSide - scaledWidth) / 2);
    // Keep the person slightly higher so feet are less likely to be cut.
    const dy = Math.max(0, Math.floor((squareSide - scaledHeight) / 2) - Math.floor(squareSide * 0.04));
    ctx.drawImage(image, dx, dy, scaledWidth, scaledHeight);

    const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.86);

    // Use optimized image only when it actually reduces payload size.
    return optimizedDataUrl.length < originalDataUrl.length ? optimizedDataUrl : originalDataUrl;
}

async function handleTryOnUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        setTryOnStatus('Preparing full-frame image for try-on...', 'info');
        tryOnImageData = await optimizeTryOnImage(file);
        tryOnPublicImageUrl = null;
        tryOnGeneratedImageUrl = null;

        const userImage = document.getElementById('try-on-user-image');
        const placeholder = document.getElementById('try-on-placeholder');
        const productOverlay = document.getElementById('try-on-product-image');
        const opacitySlider = document.getElementById('overlay-opacity');

        userImage.src = tryOnImageData;
        userImage.classList.remove('hidden');
        placeholder.classList.add('hidden');

        if (productOverlay && opacitySlider) {
            productOverlay.style.opacity = String(Number(opacitySlider.value) / 100);
        }

        setTryOnStatus('Image uploaded. Click Generate Try-On to create AI output.', 'info');
    } catch (error) {
        console.error('Try-on upload processing error:', error);
        setTryOnStatus(error.message || 'Could not process uploaded image', 'error');
        alert(error.message || 'Could not process uploaded image');
    }
}

async function callTryOnAPI(personImageUrl, garmentImageUrl, garmentDescription) {
    const controller = new AbortController();
    const timeoutMs = 120000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const payload = {
        personImage: personImageUrl,
        garmentImage: garmentImageUrl,
        garmentDescription,
        category: 'upper_body'
    };

    try {
        console.log('Calling try-on API...');
        const response = await fetch(TRYON_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.success || !data.outputImage) {
            throw new Error(data.error || 'Try-on generation failed. Please try again.');
        }

        return data.outputImage;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Generation is taking too long. Please try a clearer/smaller photo and retry.');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

function setTryOnStatus(message, type = 'info') {
    const panel = document.querySelector('.try-on-panel');
    if (!panel) return;

    let statusEl = document.getElementById('try-on-status');
    if (!statusEl) {
        statusEl = document.createElement('p');
        statusEl.id = 'try-on-status';
        statusEl.style.marginTop = '10px';
        statusEl.style.fontSize = '0.92rem';
        panel.appendChild(statusEl);
    }

    const colors = {
        info: '#4f5e70',
        success: '#17663a',
        error: '#b42318'
    };

    statusEl.textContent = message;
    statusEl.style.color = colors[type] || colors.info;
}

function setTryOnLoading(isLoading) {
    const btn = document.getElementById('generate-tryon');
    if (!btn) return;

    if (isLoading) {
        btn.disabled = true;
        btn.dataset.originalText = btn.dataset.originalText || btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    } else {
        btn.disabled = false;
        btn.innerHTML = btn.dataset.originalText || 'Generate Try-On';
    }
}

async function handleGenerateTryOn() {
    try {
        if (!tryOnImageData) {
            throw new Error('Please upload your image first');
        }

        if (!canUseTryOn(currentProduct)) {
            throw new Error('Try-On is available for upper-body clothing only');
        }

        setTryOnLoading(true);
        setTryOnStatus('Preparing garment reference...', 'info');
        const garmentImageForTryOn = await buildGarmentReferenceImage(currentProduct);

        setTryOnStatus('Generating AI try-on result... This can take 20-60 seconds.', 'info');
        const garmentDescription = currentProduct?.description || `${currentProduct?.name || 'Garment'} for upper body`;
        const generatedUrl = await callTryOnAPI(tryOnImageData, garmentImageForTryOn, garmentDescription);
        tryOnGeneratedImageUrl = generatedUrl;
        console.log('Try-on generated URL:', generatedUrl);

        const userImage = document.getElementById('try-on-user-image');
        const productOverlay = document.getElementById('try-on-product-image');
        const placeholder = document.getElementById('try-on-placeholder');

        userImage.src = generatedUrl;
        userImage.classList.remove('hidden');
        placeholder.classList.add('hidden');

        // AI result already contains garment + person, so hide overlay.
        productOverlay.style.opacity = '0';

        setTryOnStatus('AI try-on generated successfully!', 'success');
    } catch (error) {
        console.error('Try-on generation error:', error);
        setTryOnStatus(error.message || 'Failed to generate try-on result', 'error');
        alert(error.message || 'Failed to generate try-on result');
    } finally {
        setTryOnLoading(false);
    }
}

function updateTryOnOpacity(event) {
    const value = Number(event.target.value) / 100;
    document.getElementById('try-on-product-image').style.opacity = String(value);
}

function clearTryOnImage() {
    tryOnImageData = null;
    tryOnPublicImageUrl = null;
    tryOnGeneratedImageUrl = null;
    tryOnGarmentReferenceData = null;
    const uploadInput = document.getElementById('try-on-upload');
    const userImage = document.getElementById('try-on-user-image');
    const placeholder = document.getElementById('try-on-placeholder');
    const productOverlay = document.getElementById('try-on-product-image');
    const opacitySlider = document.getElementById('overlay-opacity');

    uploadInput.value = '';
    userImage.src = '';
    userImage.classList.add('hidden');
    placeholder.classList.remove('hidden');

    if (opacitySlider) {
        opacitySlider.value = '0';
    }

    if (productOverlay) {
        productOverlay.style.opacity = '0';
    }

    setTryOnStatus('', 'info');
}

// ========== Cart Management ==========
function addToCart(product, size = null) {
    const userKey = getUserKey();
    if (!userCarts[userKey]) {
        userCarts[userKey] = [];
    }
    
    const cart = userCarts[userKey];
    const existingItem = cart.find(item => 
        item.product.id === product.id && 
        (size ? item.size === size : true)
    );
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        const cartItem = {
            product: product,
            quantity: 1,
            size: size,
            addedAt: Date.now(),
            initialDiscount: product.discount
        };
        cart.push(cartItem);
        
        // Start discount timer for this item
        startDiscountTimer(cartItem);
    }
    
    saveCart();
    updateCartCount();
    updateCartDisplay();
    
    // Show success message
    showNotification('Added to cart!');
}

function removeFromCart(index) {
    const userKey = getUserKey();
    userCarts[userKey].splice(index, 1);
    saveCart();
    updateCartCount();
    updateCartDisplay();
}

function updateQuantity(index, change) {
    const userKey = getUserKey();
    const item = userCarts[userKey][index];
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(index);
    } else {
        saveCart();
        updateCartDisplay();
    }
}

function saveCart() {
    const userKey = getUserKey();
    if (userKey === 'guest') {
        localStorage.setItem('shopkart_guest_cart', JSON.stringify(userCarts[userKey]));
    } else if (currentUser) {
        localStorage.setItem(`cart_${currentUser.email}`, JSON.stringify(userCarts[userKey]));
    }
}

function updateCartCount() {
    const userKey = getUserKey();
    const cart = userCarts[userKey] || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function updateCartDisplay() {
    const userKey = getUserKey();
    const cart = userCarts[userKey] || [];
    const cartItems = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-state"><i class="fas fa-shopping-cart"></i><p>Your cart is empty</p></div>';
        document.querySelector('.sidebar-footer').style.display = 'none';
        return;
    }
    
    document.querySelector('.sidebar-footer').style.display = 'block';
    cartItems.innerHTML = '';
    
    let subtotal = 0;
    let totalDiscount = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.product.price * item.quantity;
        subtotal += itemTotal;
        
        // Calculate time-based discount
        const currentDiscount = calculateTimeBasedDiscount(item);
        const discountAmount = (itemTotal * currentDiscount) / 100;
        totalDiscount += discountAmount;
        
        // Calculate time in cart
        const timeInCart = Date.now() - item.addedAt;
        const minutesInCart = Math.floor(timeInCart / (1000 * 60));
        const hoursInCart = Math.floor(minutesInCart / 60);
        const remainingMinutes = minutesInCart % 60;
        
        let timeInCartText = '';
        if (hoursInCart > 0) {
            timeInCartText = `${hoursInCart}h ${remainingMinutes}m`;
        } else if (minutesInCart > 0) {
            timeInCartText = `${minutesInCart} min`;
        } else {
            timeInCartText = 'Just added';
        }
        
        // Calculate time until next discount decrease (30 min intervals)
        const minutesUntilDecrease = 30 - (minutesInCart % 30);
        const nextDiscount = Math.max(5, currentDiscount - 1);
        
        // Format time until decrease
        let timeUntilText = '';
        if (minutesUntilDecrease >= 60) {
            const hours = Math.floor(minutesUntilDecrease / 60);
            const mins = minutesUntilDecrease % 60;
            timeUntilText = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
        } else {
            timeUntilText = `${minutesUntilDecrease} min`;
        }
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.product.name}</h4>
                ${item.size ? `<p class="cart-item-size">Size: ${item.size}</p>` : ''}
                <p class="cart-item-time"><i class="fas fa-clock"></i> In cart: ${timeInCartText}</p>
                <div class="discount-badge">
                    <i class="fas fa-tag"></i> ${currentDiscount.toFixed(1)}% OFF - Save ₹${discountAmount.toFixed(0)}
                </div>
                ${currentDiscount > 5 ? `<p class="discount-warning"><i class="fas fa-exclamation-circle"></i> Buy now! Discount drops to ${nextDiscount}% in ${timeUntilText}</p>` : '<p class="discount-minimum"><i class="fas fa-info-circle"></i> Minimum discount reached</p>'}
                <div class="cart-item-price">₹${itemTotal}</div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    const total = subtotal - totalDiscount;
    
    document.getElementById('cart-subtotal').textContent = `₹${subtotal}`;
    document.getElementById('cart-discount').textContent = `-₹${totalDiscount.toFixed(0)}`;
    document.getElementById('cart-total').textContent = `₹${total.toFixed(0)}`;
    
    // Update discount timer display
    updateDiscountTimer();
}

function calculateTimeBasedDiscount(cartItem) {
    const timeInCart = Date.now() - cartItem.addedAt;
    const minutesInCart = timeInCart / (1000 * 60);
    
    // Discount decreases by 1% every 30 minutes, min 5%
    const discountReduction = Math.floor(minutesInCart / 30);
    const currentDiscount = Math.max(5, cartItem.initialDiscount - discountReduction);
    
    return currentDiscount;
}

function startDiscountTimer(cartItem) {
    // Update discount display periodically
    // Main timer runs every 30 seconds in the global interval
}

function updateDiscountTimer() {
    const userKey = getUserKey();
    const cart = userCarts[userKey] || [];
    
    if (cart.length === 0) return;
    
    // Find the item with the most discount remaining
    let oldestItem = cart[0];
    cart.forEach(item => {
        if (item.addedAt < oldestItem.addedAt) {
            oldestItem = item;
        }
    });
    
    const timeInCart = Date.now() - oldestItem.addedAt;
    const minutesInCart = Math.floor(timeInCart / (1000 * 60));
    const nextDiscountChange = 30 - (minutesInCart % 30);
    
    const timer = document.getElementById('timer-display');
    if (timer) {
        if (nextDiscountChange >= 60) {
            const hours = Math.floor(nextDiscountChange / 60);
            const mins = nextDiscountChange % 60;
            timer.textContent = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
        } else {
            timer.textContent = `${nextDiscountChange} min`;
        }
    }
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('active');
    updateCartDisplay();
}

// ========== Wishlist Management ==========
function addToWishlist(product) {
    const userKey = getUserKey();
    if (!userWishlists[userKey]) {
        userWishlists[userKey] = [];
    }
    
    const wishlist = userWishlists[userKey];
    const exists = wishlist.find(item => item.id === product.id);
    
    if (exists) {
        showNotification('Already in wishlist!');
        return;
    }
    
    wishlist.push(product);
    saveWishlist();
    updateWishlistCount();
    showNotification('Added to wishlist!');
}

function removeFromWishlist(productId) {
    const userKey = getUserKey();
    const index = userWishlists[userKey].findIndex(item => item.id === productId);
    if (index > -1) {
        userWishlists[userKey].splice(index, 1);
        saveWishlist();
        updateWishlistCount();
        updateWishlistDisplay();
    }
}

function moveToCart(productId) {
    if (isGuest) {
        showLoginRequiredModal();
        return;
    }
    
    const userKey = getUserKey();
    const product = userWishlists[userKey].find(item => item.id === productId);
    if (product) {
        addToCart(product);
        removeFromWishlist(productId);
    }
}

function saveWishlist() {
    const userKey = getUserKey();
    if (userKey === 'guest') {
        localStorage.setItem('shopkart_guest_wishlist', JSON.stringify(userWishlists[userKey]));
    } else if (currentUser) {
        localStorage.setItem(`wishlist_${currentUser.email}`, JSON.stringify(userWishlists[userKey]));
    }
}

function updateWishlistCount() {
    const userKey = getUserKey();
    const wishlist = userWishlists[userKey] || [];
    document.getElementById('wishlist-count').textContent = wishlist.length;
}

function updateWishlistDisplay() {
    const userKey = getUserKey();
    const wishlist = userWishlists[userKey] || [];
    const wishlistItems = document.getElementById('wishlist-items');
    
    if (wishlist.length === 0) {
        wishlistItems.innerHTML = '<div class="empty-state"><i class="fas fa-heart"></i><p>Your wishlist is empty</p></div>';
        return;
    }
    
    wishlistItems.innerHTML = '';
    
    wishlist.forEach(product => {
        const item = document.createElement('div');
        item.className = 'wishlist-item';
        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="wishlist-item-image">
            <div class="wishlist-item-details">
                <h4>${product.name}</h4>
                <p>${product.category}</p>
                <div class="cart-item-price">₹${product.price}</div>
                <div class="cart-item-actions">
                    <button class="btn btn-primary btn-sm" onclick="moveToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Move to Cart
                    </button>
                    <button class="remove-item" onclick="removeFromWishlist(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        wishlistItems.appendChild(item);
    });
}

function toggleWishlist() {
    const sidebar = document.getElementById('wishlist-sidebar');
    sidebar.classList.toggle('active');
    updateWishlistDisplay();
}

// ========== Checkout Process ==========
function proceedToCheckout() {
    if (isGuest) {
        showLoginRequiredModal();
        return;
    }
    
    const userKey = getUserKey();
    const cart = userCarts[userKey] || [];
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    document.getElementById('cart-sidebar').classList.remove('active');
    document.getElementById('checkout-modal').classList.add('active');
    
    // Load and display saved addresses
    loadSavedAddresses();

    // Initialize delivery date picker defaults and limits
    initializeDeliveryDateField();
    
    // Reset to first step
    showCheckoutStep(1);
}

function showCheckoutStep(stepNumber) {
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index < stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Show correct step content
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.classList.remove('active');
    });
    
    if (stepNumber === 1) {
        document.getElementById('address-step').classList.add('active');
    } else if (stepNumber === 2) {
        document.getElementById('payment-step').classList.add('active');
    } else if (stepNumber === 3) {
        document.getElementById('review-step').classList.add('active');
        populateOrderReview();
    }
}

function continueToPayment() {
    const userKey = getUserKey();
    const addresses = userAddresses[userKey] || [];
    
    // Check if using saved address or new address
    if (selectedAddress !== null && addresses.length > 0) {
        // Using saved address
        showCheckoutStep(2);
    } else {
        // Validate new address form
        const name = document.getElementById('addr-name').value;
        const phone = document.getElementById('addr-phone').value;
        const line1 = document.getElementById('addr-line1').value;
        const city = document.getElementById('addr-city').value;
        const state = document.getElementById('addr-state').value;
        const pincode = document.getElementById('addr-pincode').value;
        
        if (!name || !phone || !line1 || !city || !state || !pincode) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Save the address if checkbox is checked
        saveNewAddress();
        
        showCheckoutStep(2);
    }
}

function backToAddress() {
    showCheckoutStep(1);
}

function continueToReview() {
    const deliveryDateInput = document.getElementById('delivery-date');
    const deliveryDateValue = deliveryDateInput.value;

    if (!deliveryDateValue) {
        alert('Please select a preferred delivery date');
        return;
    }

    if (deliveryDateInput.min && deliveryDateValue < deliveryDateInput.min) {
        alert('Please select a valid delivery date');
        return;
    }

    selectedDeliveryDate = deliveryDateValue;
    showCheckoutStep(3);
}

function backToPayment() {
    showCheckoutStep(2);
}

function populateOrderReview() {
    // Get user key once at the start
    const userKey = getUserKey();
    
    // Get address from saved or form
    const addresses = userAddresses[userKey] || [];
    let address;
    
    if (selectedAddress !== null && addresses.length > 0) {
        // Use saved address
        address = addresses[selectedAddress];
    } else {
        // Use form data
        address = {
            name: document.getElementById('addr-name').value,
            phone: document.getElementById('addr-phone').value,
            line1: document.getElementById('addr-line1').value,
            line2: document.getElementById('addr-line2').value,
            city: document.getElementById('addr-city').value,
            state: document.getElementById('addr-state').value,
            pincode: document.getElementById('addr-pincode').value
        };
    }
    
    document.getElementById('review-address').innerHTML = `
        <strong>${address.name}</strong><br>
        ${address.phone}<br>
        ${address.line1}${address.line2 ? ', ' + address.line2 : ''}<br>
        ${address.city}, ${address.state} - ${address.pincode}
    `;
    
    // Payment method
    const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
    const paymentLabels = {
        'card': 'Credit/Debit Card',
        'upi': 'UPI',
        'netbanking': 'Net Banking',
        'cod': 'Cash on Delivery'
    };
    document.getElementById('review-payment').textContent = paymentLabels[selectedPayment];

    const deliveryDateInput = document.getElementById('delivery-date');
    const deliveryDateValue = selectedDeliveryDate || deliveryDateInput.value;
    const parsedDeliveryDate = new Date(`${deliveryDateValue}T12:00:00`);
    document.getElementById('review-delivery-date').textContent = parsedDeliveryDate.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    // Order items (reuse userKey from above)
    const cart = userCarts[userKey] || [];
    const reviewItems = document.getElementById('review-items');
    reviewItems.innerHTML = '';
    
    cart.forEach(item => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML = `
            <span>${item.product.name} ${item.size ? '(' + item.size + ')' : ''} x ${item.quantity}</span>
            <span>₹${item.product.price * item.quantity}</span>
        `;
        reviewItems.appendChild(reviewItem);
    });
    
    // Price details
    let subtotal = 0;
    let totalDiscount = 0;
    
    cart.forEach(item => {
        const itemTotal = item.product.price * item.quantity;
        subtotal += itemTotal;
        const currentDiscount = calculateTimeBasedDiscount(item);
        const discountAmount = (itemTotal * currentDiscount) / 100;
        totalDiscount += discountAmount;
    });
    
    const total = subtotal - totalDiscount;
    
    document.getElementById('review-subtotal').textContent = `₹${subtotal}`;
    document.getElementById('review-discount').textContent = `-₹${totalDiscount.toFixed(0)}`;
    document.getElementById('review-total').textContent = `₹${total.toFixed(0)}`;
}

async function placeOrder() {
    // Generate order number
    const orderNumber = 'SK' + Date.now();
    
    // Get cart items before clearing
    const userKey = getUserKey();
    const orderItems = userCarts[userKey].map(item => ({
        ...item,
        returnStatus: 'none',
        returnTicketNumber: null,
        returnRequestedAt: null,
        returnCancelledAt: null
    }));
    
    // Get address details from saved or form
    const addresses = userAddresses[userKey] || [];
    let orderAddress;
    
    if (selectedAddress !== null && addresses.length > 0) {
        // Use saved address
        orderAddress = addresses[selectedAddress];
    } else {
        // Use form data
        orderAddress = {
            name: document.getElementById('addr-name').value,
            phone: document.getElementById('addr-phone').value,
            line1: document.getElementById('addr-line1').value,
            line2: document.getElementById('addr-line2').value,
            city: document.getElementById('addr-city').value,
            state: document.getElementById('addr-state').value,
            pincode: document.getElementById('addr-pincode').value
        };
    }
    
    // Get payment method
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const deliveryDateValue = selectedDeliveryDate || document.getElementById('delivery-date').value;
    const deliveryDateIso = new Date(`${deliveryDateValue}T12:00:00`).toISOString();
    
    // Calculate totals
    let subtotal = 0;
    let totalDiscount = 0;
    orderItems.forEach(item => {
        const itemTotal = item.product.price * item.quantity;
        subtotal += itemTotal;
        const currentDiscount = calculateTimeBasedDiscount(item);
        const discountAmount = (itemTotal * currentDiscount) / 100;
        totalDiscount += discountAmount;
    });
    
    // Save order to user's order history
    const order = {
        userId: currentUser.uid || currentUser.email,
        orderNumber: orderNumber,
        date: new Date().toISOString(),
        items: orderItems,
        address: orderAddress,
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        discount: totalDiscount,
        total: subtotal - totalDiscount,
        status: 'Delivered', // For demo, marking as delivered so user can return
        deliveryDate: deliveryDateIso,
        canReturn: true
    };

    // Persist order in backend DB.
    try {
        const response = await fetch(`${API_BASE}/order/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Failed to save order');
        }
    } catch (err) {
        console.error('Failed to save order in MongoDB:', err);
        showNotification('Order placed locally, but DB save failed. Please try again.');
    }
    
    // Store order
    if (!userOrders[userKey]) {
        userOrders[userKey] = [];
    }
    userOrders[userKey].unshift(order); // Add to beginning
    localStorage.setItem(`orders_${userKey}`, JSON.stringify(userOrders[userKey]));
    
    // Clear cart
    userCarts[userKey] = [];
    saveCart();
    updateCartCount();
    
    // Close checkout modal
    closeModal('checkout-modal');
    
    // Show success modal
    document.getElementById('order-number').textContent = orderNumber;
    document.getElementById('order-success-modal').classList.add('active');
    
    // Reset checkout form and selection
    document.getElementById('address-form').reset();
    document.getElementById('delivery-date').value = '';
    selectedAddress = null;
    selectedDeliveryDate = null;
}

function initializeDeliveryDateField() {
    const deliveryDateInput = document.getElementById('delivery-date');
    if (!deliveryDateInput) return;

    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 1);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);

    const defaultDate = new Date(today);
    defaultDate.setDate(today.getDate() + 2);

    const toDateInputValue = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    deliveryDateInput.min = toDateInputValue(minDate);
    deliveryDateInput.max = toDateInputValue(maxDate);
    deliveryDateInput.value = selectedDeliveryDate || toDateInputValue(defaultDate);
    selectedDeliveryDate = deliveryDateInput.value;
}

// ========== Orders & Returns ==========
function showOrdersModal() {
    if (isGuest) {
        showLoginRequiredModal();
        return;
    }
    
    const userKey = getUserKey();
    const orders = userOrders[userKey] || [];
    const ordersList = document.getElementById('orders-list');
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><p>No orders yet</p><p>Start shopping to see your orders here!</p></div>';
    } else {
        ordersList.innerHTML = '';
        orders.forEach(order => {
            const orderCard = createOrderCard(order);
            ordersList.appendChild(orderCard);
        });
    }
    
    document.getElementById('orders-modal').classList.add('active');
}

function createOrderCard(order) {
    const orderDate = new Date(order.date).toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    const deliveryDate = new Date(order.deliveryDate).toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    // Check if within 7 days of delivery for returns
    const daysSinceDelivery = Math.floor((Date.now() - new Date(order.deliveryDate).getTime()) / (1000 * 60 * 60 * 24));
    const canReturn = order.canReturn && daysSinceDelivery <= 7 && order.status === 'Delivered';
    
    const card = document.createElement('div');
    card.className = 'order-card';
    card.innerHTML = `
        <div class="order-header">
            <div>
                <h3>Order #${order.orderNumber}</h3>
                <p class="order-date">Placed on ${orderDate}</p>
            </div>
            <div class="order-status ${order.status.toLowerCase()}">${order.status}</div>
        </div>
        <div class="order-items">
            ${order.items.map(item => `
                <div class="order-item">
                    <img src="${item.product.image}" alt="${item.product.name}">
                    <div class="order-item-details">
                        <h4>${item.product.name}</h4>
                        ${item.size ? `<p>Size: ${item.size}</p>` : ''}
                        <p>Qty: ${item.quantity}</p>
                        <p class="order-item-price">₹${item.product.price * item.quantity}</p>
                    </div>
                    <div class="order-item-action">
                        ${canReturn && (!item.returnStatus || item.returnStatus === 'none') ? `
                            <button class="btn btn-outline btn-sm" onclick="initiateReturn('${order.orderNumber}', ${item.product.id}, '${item.size || ''}')">
                                <i class="fas fa-undo"></i> Return
                            </button>
                        ` : ''}
                        ${item.returnStatus === 'requested' ? `<span class="return-state-badge requested"><i class="fas fa-check-circle"></i> Return Confirmed</span>` : ''}
                        ${item.returnStatus === 'confirmed' ? `<span class="return-state-badge requested"><i class="fas fa-check-circle"></i> Return Confirmed</span>` : ''}
                        ${item.returnStatus === 'cancelled' ? `<span class="return-state-badge cancelled"><i class="fas fa-ban"></i> Return Cancelled</span>` : ''}
                        ${item.returnStatus === 'requested' ? `
                            <button class="btn btn-outline btn-sm btn-cancel-return" onclick="cancelReturnRequest('${order.orderNumber}', ${item.product.id}, '${item.size || ''}')">
                                <i class="fas fa-times"></i> Cancel Return
                            </button>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="order-footer">
            <div class="order-total">
                <span>Total Amount:</span>
                <span class="amount">₹${order.total.toFixed(0)}</span>
            </div>
            ${canReturn ? `<p class="return-info"><i class="fas fa-info-circle"></i> Return available until ${new Date(new Date(order.deliveryDate).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}</p>` : ''}
            ${!canReturn && order.status === 'Delivered' ? '<p class="return-expired"><i class="fas fa-times-circle"></i> Return period expired</p>' : ''}
        </div>
    `;
    return card;
}

function initiateReturn(orderNumber, productId, size) {
    const userKey = getUserKey();
    const order = userOrders[userKey].find(o => o.orderNumber === orderNumber);
    
    if (!order) return;
    
    const item = order.items.find(i => i.product.id === productId && (size ? i.size === size : true));
    
    if (!item) return;

    if (item.returnStatus && item.returnStatus !== 'none') {
        alert('Return request already submitted for this item.');
        return;
    }
    
    currentReturnOrder = {
        orderNumber: orderNumber,
        item: item
    };
    
    // Populate return product info
    const returnProductInfo = document.getElementById('return-product-info');
    returnProductInfo.innerHTML = `
        <div class="return-product-card">
            <img src="${item.product.image}" alt="${item.product.name}">
            <div>
                <h3>${item.product.name}</h3>
                ${item.size ? `<p>Size: ${item.size}</p>` : ''}
                <p>Quantity: ${item.quantity}</p>
                <p class="price">₹${item.product.price * item.quantity}</p>
            </div>
        </div>
    `;
    
    // Reset form
    document.getElementById('return-form').reset();
    
    // Show return modal
    document.getElementById('return-request-modal').classList.add('active');
}

function submitReturnRequest(e) {
    e.preventDefault();
    
    const reason = document.getElementById('return-reason').value;
    const comments = document.getElementById('return-comments').value;
    const method = document.querySelector('input[name="return-method"]:checked').value;
    
    if (!reason) {
        alert('Please select a reason for return');
        return;
    }
    
    // Generate return ticket
    const ticketNumber = 'RT' + Date.now();
    
    // Store return request (in production, send to server)
    const returnRequest = {
        ticketNumber: ticketNumber,
        orderNumber: currentReturnOrder.orderNumber,
        item: currentReturnOrder.item,
        reason: reason,
        comments: comments,
        method: method,
        date: new Date().toISOString(),
        status: 'Confirmed'
    };
    
    // Save to localStorage (demo)
    const userKey = getUserKey();
    const returns = JSON.parse(localStorage.getItem(`returns_${userKey}`) || '[]');
    returns.unshift(returnRequest);
    localStorage.setItem(`returns_${userKey}`, JSON.stringify(returns));

    const order = userOrders[userKey]?.find(o => o.orderNumber === currentReturnOrder.orderNumber);
    if (order) {
        const targetItem = order.items.find(i =>
            i.product.id === currentReturnOrder.item.product.id &&
            (currentReturnOrder.item.size ? i.size === currentReturnOrder.item.size : true)
        );

        if (targetItem) {
            targetItem.returnStatus = 'requested';
            targetItem.returnTicketNumber = ticketNumber;
            targetItem.returnRequestedAt = new Date().toISOString();
            targetItem.returnCancelledAt = null;
            localStorage.setItem(`orders_${userKey}`, JSON.stringify(userOrders[userKey]));
        }
    }
    
    // Close return request modal
    closeModal('return-request-modal');
    
    // Show success modal
    document.getElementById('return-ticket-number').textContent = ticketNumber;
    document.getElementById('return-success-modal').classList.add('active');
    showOrdersModal();
    
    showNotification('Return request submitted successfully!');
}

function cancelReturnRequest(orderNumber, productId, size) {
    const userKey = getUserKey();
    const order = userOrders[userKey]?.find(o => o.orderNumber === orderNumber);
    if (!order) return;

    const targetItem = order.items.find(i => i.product.id === productId && (size ? i.size === size : true));
    if (!targetItem || targetItem.returnStatus !== 'requested') {
        return;
    }

    if (!confirm('Cancel this return request?')) {
        return;
    }

    targetItem.returnStatus = 'cancelled';
    targetItem.returnCancelledAt = new Date().toISOString();

    const returns = JSON.parse(localStorage.getItem(`returns_${userKey}`) || '[]');
    const updatedReturns = returns.map((ret) => {
        const isSameOrder = ret.orderNumber === orderNumber;
        const isSameProduct = ret.item?.product?.id === productId;
        const sameSize = (ret.item?.size || '') === (size || '');
        if (isSameOrder && isSameProduct && sameSize && ret.status !== 'Cancelled') {
            return {
                ...ret,
                status: 'Cancelled',
                cancelledAt: new Date().toISOString()
            };
        }
        return ret;
    });

    localStorage.setItem(`returns_${userKey}`, JSON.stringify(updatedReturns));
    localStorage.setItem(`orders_${userKey}`, JSON.stringify(userOrders[userKey]));

    showOrdersModal();
    showNotification('Return request cancelled.');
}

// ========== Address Management ==========
function loadSavedAddresses() {
    const userKey = getUserKey();
    const addresses = userAddresses[userKey] || [];
    const addressesList = document.getElementById('saved-addresses-list');
    const savedContainer = document.getElementById('saved-addresses-container');
    const newFormContainer = document.getElementById('new-address-form-container');
    
    if (addresses.length === 0) {
        // No saved addresses, show new address form
        savedContainer.classList.add('hidden');
        newFormContainer.classList.remove('hidden');
        document.getElementById('cancel-new-address')?.classList.add('hidden');
    } else {
        // Show saved addresses
        savedContainer.classList.remove('hidden');
        newFormContainer.classList.add('hidden');
        
        addressesList.innerHTML = '';
        addresses.forEach((address, index) => {
            const addressCard = createAddressCard(address, index);
            addressesList.appendChild(addressCard);
        });
    }
}

function createAddressCard(address, index) {
    const card = document.createElement('div');
    card.className = 'address-card';
    if (selectedAddress === index) {
        card.classList.add('selected');
    }
    
    card.innerHTML = `
        ${selectedAddress === index ? '<div class="selected-badge"><i class="fas fa-check"></i></div>' : ''}
        <div class="address-header">
            <div class="address-name">${address.name}</div>
            ${address.isDefault ? '<span class="address-default">Default</span>' : ''}
        </div>
        <div class="address-details">
            ${address.line1}${address.line2 ? ', ' + address.line2 : ''}<br>
            ${address.city}, ${address.state} - ${address.pincode}
        </div>
        <div class="address-phone"><i class="fas fa-phone"></i> ${address.phone}</div>
        <div class="address-actions">
            ${!address.isDefault ? `<button class="btn-link" onclick="setDefaultAddress(${index})">Set as Default</button>` : ''}
            <button class="btn-link delete-btn" onclick="deleteAddress(${index})">Delete</button>
        </div>
    `;
    
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('btn-link')) {
            selectAddress(index);
            // Automatically proceed to payment
            setTimeout(() => {
                continueToPayment();
            }, 300);
        }
    });
    
    return card;
}

function selectAddress(index) {
    selectedAddress = index;
    loadSavedAddresses();
}

function setDefaultAddress(index) {
    const userKey = getUserKey();
    const addresses = userAddresses[userKey] || [];
    
    // Remove default from all addresses
    addresses.forEach(addr => addr.isDefault = false);
    
    // Set new default
    addresses[index].isDefault = true;
    
    // Save to localStorage
    localStorage.setItem(`addresses_${userKey}`, JSON.stringify(addresses));
    
    loadSavedAddresses();
    showNotification('Default address updated!');
}

function deleteAddress(index) {
    if (!confirm('Are you sure you want to delete this address?')) {
        return;
    }
    
    const userKey = getUserKey();
    const addresses = userAddresses[userKey] || [];
    
    addresses.splice(index, 1);
    
    // If deleted address was selected, reset selection
    if (selectedAddress === index) {
        selectedAddress = null;
    } else if (selectedAddress > index) {
        selectedAddress--;
    }
    
    // Save to localStorage
    userAddresses[userKey] = addresses;
    localStorage.setItem(`addresses_${userKey}`, JSON.stringify(addresses));
    
    loadSavedAddresses();
    showNotification('Address deleted successfully!');
}

function saveNewAddress() {
    const name = document.getElementById('addr-name').value;
    const phone = document.getElementById('addr-phone').value;
    const line1 = document.getElementById('addr-line1').value;
    const line2 = document.getElementById('addr-line2').value;
    const city = document.getElementById('addr-city').value;
    const state = document.getElementById('addr-state').value;
    const pincode = document.getElementById('addr-pincode').value;
    const saveAddress = document.getElementById('save-address-checkbox').checked;
    
    const address = {
        name,
        phone,
        line1,
        line2,
        city,
        state,
        pincode,
        isDefault: false
    };
    
    if (saveAddress) {
        const userKey = getUserKey();
        if (!userAddresses[userKey]) {
            userAddresses[userKey] = [];
        }
        
        // If this is the first address, make it default
        if (userAddresses[userKey].length === 0) {
            address.isDefault = true;
        }
        
        userAddresses[userKey].push(address);
        localStorage.setItem(`addresses_${userKey}`, JSON.stringify(userAddresses[userKey]));
        
        showNotification('Address saved successfully!');
    }
    
    return address;
}

// ========== User Profile ==========
function showUserProfile() {
    if (isGuest) {
        showLoginRequiredModal();
        return;
    }
    
    if (currentUser) {
        const message = currentUser.provider === 'google' 
            ? `Logged in with Google as: ${currentUser.email}\n${currentUser.name}\n\nClick OK to logout`
            : `Logged in as: ${currentUser.email}\n\nClick OK to logout`;
        
        if (confirm(message)) {
            logout();
        }
    }
}

function logout() {
    // If user logged in with Firebase, use Firebase signOut
    if (currentUser && currentUser.provider === 'google' && window.firebaseLogout) {
        window.firebaseLogout();
    } else {
        // Regular logout
        currentUser = null;
        isGuest = false;
        localStorage.removeItem('shopkart_user');
        location.reload();
    }
}

// ========== Login Required Modal ==========
function showLoginRequiredModal() {
    document.getElementById('login-required-modal').classList.add('active');
}

// ========== Utility Functions ==========
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showNotification(message) {
    // Simple notification (you can enhance this)
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .btn-sm {
        padding: 8px 15px;
        font-size: 0.85rem;
    }
`;
document.head.appendChild(style);

// Start updating cart display timer - update every 30 seconds for more accurate countdown
setInterval(() => {
    if (document.getElementById('cart-sidebar').classList.contains('active')) {
        updateCartDisplay();
    }
}, 30000); // Update every 30 seconds
