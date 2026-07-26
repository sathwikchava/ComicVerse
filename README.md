# ComicVerse 📚⚡

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen.svg)](https://www.mongodb.com/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-purple.svg)](https://clerk.com/)
[![Razorpay](https://img.shields.io/badge/Payment-Razorpay-blue.svg)](https://razorpay.com/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black.svg)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-informational.svg)](https://render.com/)

**ComicVerse** is a full-stack, feature-rich web platform dedicated to comic book enthusiasts. It offers an immersive experience where fans can explore comic universe archives, discover iconic character profiles across legendary publishers (DC, Marvel, Disney, Dark Horse, Archie), view comic-inspired movies, and purchase comic books through a seamless e-commerce store with secure payment processing and authentication.

---

## 🔗 Live Deployments

- 🌐 **Frontend (Vercel)**: Deployed on Vercel Global CDN
- ⚙️ **Backend API (Render)**: [https://comicverse-ooir.onrender.com](https://comicverse-ooir.onrender.com)

---

## 🌟 Key Features

- 🛒 **Dynamic E-Commerce Store & Cart**: Real-time item count update, cart calculation, item removal, and persistent local storage basket.
- 🔐 **User Authentication (Clerk SDK)**: Fast, secure authentication flow with user profile management, session token synchronization, and protected checkout routes.
- 💳 **Secure Payment Gateway (Razorpay & Backend HMAC Verification)**: End-to-end payment creation, checkout UI integration, and server-side HMAC SHA-256 signature verification.
- 🦸 **Expansive Character & Universe Directory**: Comprehensive rosters detailing powers, publisher origin, comic appearances, and backstories for hundreds of comic characters.
- 🎥 **Media & Movie Hub**: Dedicated catalog for comic-adapted cinema, animated series, and media universe releases.
- 🎨 **Modern Dark Comic Aesthetic**: Vibrant green-yellow highlights (`#adff2f`), responsive navigation bar with live auth status, dynamic card hover effects, and clean UI components.

---

## 📁 Repository Structure

```
ComicVerse/
├── 📄 home.html            # Main Landing & Featured Universe Portal
├── 📄 index.html           # Landing Showcase
├── 📄 store.html           # Comic Book E-Commerce Catalog
├── 📄 cart.html            # Shopping Cart & Checkout Interface
├── 📄 char.html            # Character Encyclopedia & Publisher Filters
├── 📄 movies.html          # Comic Movies & Cinema Media Portal
├── 📄 login.html           # User Login Portal
├── 📄 signup.html          # User Registration Portal
├── 📄 success.html        # Post-Purchase Success Confirmation Page
├── 📄 cancel.html         # Payment Cancellation / Failure Handler
├── 📄 data.js              # Shop Items Data Array (Products & Pricing)
├── 📄 cart.js              # Cart State Management & Razorpay Client Checkout Logic
├── 📄 auth.js              # Clerk Auth Integration & Render Backend URL Sync
├── 📄 script.js            # General UI Interactions & Sliders
├── 📄 vercel.json          # Vercel Deployment & Route Rewrites Configuration
├── 📄 *.css                # Modular Styling (home, nav, footer, store, char, movies)
├── 📁 server/              # Express Backend Microservice
│   ├── 📄 server.js        # Entry point & CORS configuration
│   ├── 📄 package.json     # Node.js Dependencies
│   ├── 📄 .env.example     # Environment Configuration Template
│   ├── 📁 middleware/      # Auth Verification Middleware
│   │   └── 📄 auth.js      # Clerk JWT Token Middleware
│   ├── 📁 models/          # Mongoose Database Schemas
│   │   └── 📄 Order.js     # Order Schema (User, Items, Payment Status)
│   └── 📁 routes/          # Express API Endpoints
│       └── 📄 payment.js   # Razorpay Order Creation & Verification Routes
├── 📄 .gitignore           # Git Exclusions for Secrets & Dependencies
└── 📄 README.md            # Repository Documentation
```

---

## ⚙️ Tech Stack

### **Frontend**
- **Hosting**: Vercel
- **Core**: HTML5, Vanilla JavaScript (ES6+)
- **Styling**: Vanilla CSS3 (Custom Dark Theme, Flexbox, CSS Grid, Micro-animations)
- **Authentication**: `@clerk/clerk-js` Browser SDK
- **Payments**: Razorpay Checkout (`checkout.js`)

### **Backend**
- **Hosting**: Render
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ORM
- **Security**: `@clerk/clerk-sdk-node` for server token validation, Crypto HMAC SHA-256 for payment validation
- **Integrations**: `razorpay` official Node.js SDK
- **Utilities**: `dotenv` for environment management, `cors` for cross-origin requests

---

## 🔒 Security Best Practices

Security is prioritized across the codebase:
1. **Secrets Isolation**: Sensitive credentials (`MONGO_URI`, `RAZORPAY_KEY_SECRET`, `CLERK_SECRET_KEY`) are kept strictly within server-side environment variables (`.env`).
2. **Git Ignore Protections**: All `.env` files, `.env.local` files, logs, and `node_modules` folders are listed in `.gitignore` to prevent secret leaks.
3. **Cryptographic Payment Verification**: Payment signatures returned by Razorpay are verified on the Express server using SHA-256 HMAC digest checking before fulfilling any order in MongoDB.
4. **Token Verification**: Protected backend routes validate user identity tokens issued by Clerk.

---

## ☁️ Deployment Guide

### 1. Backend Deployment (Render)

1. Create a **Web Service** on [Render](https://dashboard.render.com).
2. Connect the GitHub Repository: `sathwikchava/ComicVerse`.
3. Set the build settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` *(or `node server.js`)*
4. Configure the **Environment Variables** in the Render Dashboard:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `MONGO_URI` | MongoDB Connection URI | `mongodb+srv://user:pass@cluster.mongodb.net/comicverse` |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | `wX8...` |
| `CLERK_PUBLISHABLE_KEY` | Clerk Publishable Key | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk Secret Key | `sk_test_...` |

---

### 2. Frontend Deployment (Vercel)

1. Create a new project on [Vercel](https://vercel.com/new).
2. Import the GitHub Repository: `sathwikchava/ComicVerse`.
3. Select **Framework Preset**: `Other` (Static Site).
4. Set **Root Directory**: `./` (Default).
5. Leave **Environment Variables** empty (No env vars required on Vercel; `auth.js` automatically connects to the Render API).
6. Click **Deploy**.

---

## 🚀 Local Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

### Installation & Execution

#### 1. Clone the Repository
```bash
git clone https://github.com/sathwikchava/ComicVerse.git
cd ComicVerse
```

#### 2. Configure Backend Environment Variables
Navigate to the `server/` directory and set up your `.env` file from the provided template:
```bash
cd server
cp .env.example .env
```
Edit `server/.env` with your credentials:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/comicverse
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_CURRENCY=INR
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

#### 3. Launch Backend Server
```bash
npm install
npm start
# Server runs at http://localhost:5000
```

#### 4. Launch Frontend
Serve the root folder using Live Server or `npx serve`:
```bash
npx serve .
# Open http://localhost:3000
```

---

## 📡 API Endpoint Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Serves `home.html` frontend landing page | No |
| `GET` | `/api/health` | Backend server health check | No |
| `POST` | `/api/payment/create-order` | Initiates a Razorpay order & creates a pending DB entry | Yes (Bearer Token) |
| `POST` | `/api/payment/verify` | Verifies Razorpay payment signature & updates order to paid | Yes (Bearer Token) |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/ComicFeature`)
3. Commit your Changes (`git commit -m 'Add exciting new ComicFeature'`)
4. Push to the Branch (`git push origin feature/ComicFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
