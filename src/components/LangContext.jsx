import { createContext, useContext, useState } from "react";

const translations = {
  en: {
    // Header
    home: "Home",
    cart: "Cart",
    myOrders: "My Orders",
    profile: "Profile",
    admin: "Admin",
    logout: "Logout",
    login: "Login",
    register: "Register",

    // Home
    heroTitle: "Welcome to",
    heroSubtitle: "Discover premium products at unbeatable prices",
    shopNow: "Shop Now →",
    searchPlaceholder: "🔍 Search products...",
    maxPrice: "Max price $",
    clearFilters: "✕ Clear",
    showingProducts: "Showing",
    product: "product",
    products: "products",
    noProducts: "No products found 😕",

    // Product
    addToCart: "Add to Cart 🛒",
    outOfStock: "Out of Stock",
    inStock: "In Stock",
    lowStock: "Only left!",
    backToProducts: "← Back to Products",
    relatedProducts: "Related Products",
    customerReviews: "Customer Reviews",
    writeReview: "Write a Review",
    submitReview: "Submit Review",
    loginToReview: "Login to leave a review",
    noReviews: "No reviews yet — be the first!",
    reviews: "reviews",

    // Cart
    yourCart: "🛒 Your Cart",
    cartEmpty: "Your cart is empty",
    continueShopping: "Continue Shopping →",
    total: "Total",
    proceedCheckout: "Proceed to Checkout →",

    // Checkout
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    discount: "Discount",
    couponPlaceholder: "Coupon code (e.g. SAVE10)",
    apply: "Apply",
    remove: "Remove",
    paymentDetails: "💳 Payment Details",
    demoOnly: "Demo only — no real payment is processed",
    cardholderName: "Cardholder Name",
    cardNumber: "Card Number",
    expiryDate: "Expiry Date",
    pay: "Pay",
    processing: "Processing payment...",

    // Auth
    welcomeBack: "Welcome Back",
    signInAccount: "Sign in to your account",
    signIn: "Sign In →",
    signingIn: "Signing in...",
    noAccount: "Don't have an account?",
    forgotPassword: "Forgot password?",
    createAccount: "Create Account",
    joinToday: "Join ModernShop today",
    fullName: "Full Name",
    emailAddress: "Email address",
    password: "Password",
    passwordMin: "Password (min 6 characters)",
    creating: "Creating account...",
    alreadyAccount: "Already have an account?",

    // Orders
    myOrdersTitle: "My Orders",
    noOrders: "No orders yet 📦",
    orderPlaced: "Order Placed",
    shipped: "Shipped",
    delivered: "Delivered",
    pending: "pending",
    items: "Items",

    // Profile
    myProfile: "My Profile",
    totalOrders: "Total Orders",
    totalSpent: "Total Spent",
    changePassword: "🔐 Change Password",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    changing: "Changing...",
    changePasswordBtn: "Change Password",
    orderHistory: "📦 Order History",
    startShopping: "Start Shopping →",

    // Admin
    adminDashboard: "Admin Dashboard",
    analytics: "📊 Analytics",
    productsTab: "🛍️ Products",
    ordersTab: "📦 Orders",
    totalRevenue: "Total Revenue",
    totalProducts: "Total Products",
    totalUsers: "Total Users",
    addProduct: "➕ Add Product",
    updateProduct: "✅ Update",
    cancel: "Cancel",
    edit: "✏️ Edit",
    delete: "🗑️ Delete",
    loading: "Loading...",
  },

  km: {
    // Header
    home: "ទំព័រដើម",
    cart: "កន្ត្រក",
    myOrders: "ការបញ្ជាទិញ",
    profile: "ប្រវត្តិរូប",
    admin: "អ្នកគ្រប់គ្រង",
    logout: "ចាកចេញ",
    login: "ចូល",
    register: "ចុះឈ្មោះ",

    // Home
    heroTitle: "សូមស្វាគមន៍មក",
    heroSubtitle: "រកឃើញផលិតផលពិសេសក្នុងតម្លៃល្អបំផុត",
    shopNow: "ទិញឥឡូវ →",
    searchPlaceholder: "🔍 ស្វែងរកផលិតផល...",
    maxPrice: "តម្លៃអតិបរមា $",
    clearFilters: "✕ លុប",
    showingProducts: "បង្ហាញ",
    product: "ផលិតផល",
    products: "ផលិតផល",
    noProducts: "រកមិនឃើញផលិតផល 😕",

    // Product
    addToCart: "បន្ថែមទៅកន្ត្រក 🛒",
    outOfStock: "អស់ស្តុក",
    inStock: "មានស្តុក",
    lowStock: "នៅសល់តែ!",
    backToProducts: "← ត្រឡប់ទៅផលិតផល",
    relatedProducts: "ផលិតផលពាក់ព័ន្ធ",
    customerReviews: "មតិអតិថិជន",
    writeReview: "សរសេរការពិនិត្យ",
    submitReview: "ដាក់ការពិនិត្យ",
    loginToReview: "ចូលដើម្បីផ្ដល់មតិ",
    noReviews: "មិនទាន់មានការពិនិត្យ — ជាអ្នកដំបូង!",
    reviews: "ការពិនិត្យ",

    // Cart
    yourCart: "🛒 កន្ត្រករបស់អ្នក",
    cartEmpty: "កន្ត្រករបស់អ្នកទទេ",
    continueShopping: "បន្តទិញ →",
    total: "សរុប",
    proceedCheckout: "ទៅបង់ប្រាក់ →",

    // Checkout
    orderSummary: "សង្ខេបការបញ្ជាទិញ",
    subtotal: "តម្លៃសរុប",
    discount: "បញ្ចុះតម្លៃ",
    couponPlaceholder: "លេខកូដគូប៉ុង",
    apply: "អនុវត្ត",
    remove: "លុប",
    paymentDetails: "💳 ព័ត៌មានបង់ប្រាក់",
    demoOnly: "គំរូប៉ុណ្ណោះ — មិនមែនការទូទាត់ពិតប្រាកដ",
    cardholderName: "ឈ្មោះអ្នកកាន់កាតរ",
    cardNumber: "លេខកាត",
    expiryDate: "កាលបរិច្ឆេទផុតកំណត់",
    pay: "បង់",
    processing: "កំពុងដំណើរការ...",

    // Auth
    welcomeBack: "សូមស្វាគមន៍មកវិញ",
    signInAccount: "ចូលគណនីរបស់អ្នក",
    signIn: "ចូល →",
    signingIn: "កំពុងចូល...",
    noAccount: "មិនទាន់មានគណនី?",
    forgotPassword: "ភ្លេចពាក្យសម្ងាត់?",
    createAccount: "បង្កើតគណនី",
    joinToday: "ចូលរួម ModernShop ថ្ងៃនេះ",
    fullName: "ឈ្មោះពេញ",
    emailAddress: "អាសយដ្ឋានអ៊ីមែល",
    password: "ពាក្យសម្ងាត់",
    passwordMin: "ពាក្យសម្ងាត់ (យ៉ាងតិច 6 តួអក្សរ)",
    creating: "កំពុងបង្កើត...",
    alreadyAccount: "មានគណនីរួចហើយ?",

    // Orders
    myOrdersTitle: "ការបញ្ជាទិញរបស់ខ្ញុំ",
    noOrders: "មិនទាន់មានការបញ្ជាទិញ 📦",
    orderPlaced: "បានបញ្ជាទិញ",
    shipped: "កំពុងដឹក",
    delivered: "បានដឹកជញ្ជូន",
    pending: "កំពុងរង់ចាំ",
    items: "ទំនិញ",

    // Profile
    myProfile: "ប្រវត្តិរូបរបស់ខ្ញុំ",
    totalOrders: "ការបញ្ជាទិញសរុប",
    totalSpent: "ចំណាយសរុប",
    changePassword: "🔐 ផ្លាស់ប្ដូរពាក្យសម្ងាត់",
    currentPassword: "ពាក្យសម្ងាត់បច្ចុប្បន្ន",
    newPassword: "ពាក្យសម្ងាត់ថ្មី",
    confirmPassword: "បញ្ជាក់ពាក្យសម្ងាត់ថ្មី",
    changing: "កំពុងផ្លាស់ប្ដូរ...",
    changePasswordBtn: "ផ្លាស់ប្ដូរពាក្យសម្ងាត់",
    orderHistory: "📦 ប្រវត្តិការបញ្ជាទិញ",
    startShopping: "ចាប់ផ្ដើមទិញ →",

    // Admin
    adminDashboard: "ផ្ទាំងគ្រប់គ្រង",
    analytics: "📊 វិភាគ",
    productsTab: "🛍️ ផលិតផល",
    ordersTab: "📦 ការបញ្ជាទិញ",
    totalRevenue: "ចំណូលសរុប",
    totalProducts: "ផលិតផលសរុប",
    totalUsers: "អ្នកប្រើប្រាស់សរុប",
    addProduct: "➕ បន្ថែមផលិតផល",
    updateProduct: "✅ អាប់ដេត",
    cancel: "បោះបង់",
    edit: "✏️ កែ",
    delete: "🗑️ លុប",
    loading: "កំពុងទាញយក...",
  }
};

const LangContext = createContext(null);

export function useLang() {
  return useContext(LangContext);
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("lang") || "en";
  });

  function toggleLang() {
    const next = lang === "en" ? "km" : "en";
    setLang(next);
    localStorage.setItem("lang", next);
  }

  const t = translations[lang];

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}
