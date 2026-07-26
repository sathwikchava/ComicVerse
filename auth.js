// Configurable configuration settings
const BACKEND_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000'
  : 'https://comicverse-ooir.onrender.com';

localStorage.setItem('BACKEND_URL', BACKEND_URL);

// Clerk Publishable Key config. Replace with your own key from Clerk Dashboard.
const CLERK_PUBLISHABLE_KEY = 'pk_test_bWlnaHR5LWZyb2ctMjIuY2xlcmsuYWNjb3VudHMuZGV2JA'; 
localStorage.setItem('CLERK_PUBLISHABLE_KEY', CLERK_PUBLISHABLE_KEY);

// Exposed global Clerk loader promise
let clerkPromise = null;

async function initClerk() {
  if (window.Clerk && window.Clerk.isReady) {
    return window.Clerk;
  }
  
  if (clerkPromise) return clerkPromise;

  clerkPromise = new Promise((resolve, reject) => {
    let script = document.querySelector('script[src*="clerk-js"]');
    
    const initialize = async () => {
      try {
        if (!window.Clerk.isReady) {
          await window.Clerk.load({
            theme: {
              variables: {
                colorPrimary: "#adff2f", // greenyellow theme
                colorBackground: "#121212",
                colorText: "#ffffff"
              }
            }
          });
        }
        resolve(window.Clerk);
      } catch (err) {
        reject(err);
      }
    };

    if (window.Clerk) {
      initialize();
      return;
    }

    if (!script) {
      let frontendApi = '';
      try {
        const parts = CLERK_PUBLISHABLE_KEY.split('_');
        if (parts[2]) {
          const decoded = atob(parts[2]);
          frontendApi = decoded.endsWith('$') ? decoded.slice(0, -1) : decoded;
        }
      } catch (e) {
        console.error("Error decoding Clerk publishable key:", e);
      }

      const domain = frontendApi || 'mighty-frog-22.clerk.accounts.dev';

      script = document.createElement('script');
      script.src = `https://${domain}/npm/@clerk/clerk-js@latest/dist/clerk.browser.js`;
      script.setAttribute('data-clerk-publishable-key', CLERK_PUBLISHABLE_KEY);
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    script.addEventListener('load', initialize);
    script.addEventListener('error', () => reject(new Error("Failed to load Clerk script")));
  });

  return clerkPromise;
}

// Helper to check authentication state and update navbar
async function updateNavbarAuth() {
  try {
    const clerk = await initClerk();
    const navList = document.querySelector('.navbar header ul') || document.querySelector('header ul');

    if (!navList) return;

    // Remove any existing auth nav items to avoid duplicates
    const existingAuthItem = document.getElementById('auth-nav-item');
    if (existingAuthItem) {
      existingAuthItem.remove();
    }

    const authLi = document.createElement('li');
    authLi.id = 'auth-nav-item';

    if (clerk.user) {
      // User is logged in with Clerk
      authLi.innerHTML = `
        <div id="clerk-user-button" style="margin-top: 5px;"></div>
      `;

      // Insert just before the cart item if possible, or append to the end
      const cartLi = navList.querySelector('a[href="cart.html"]')?.parentElement || navList.querySelector('.cart')?.parentElement;
      if (cartLi) {
        navList.insertBefore(authLi, cartLi);
      } else {
        navList.appendChild(authLi);
      }

      // Mount the Clerk User Profile Button
      clerk.mountUserButton(document.getElementById('clerk-user-button'), {
        afterSignOutUrl: 'home.html'
      });

      // Synchronize session token to local storage for standard calls
      const token = await clerk.session.getToken();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        id: clerk.user.id,
        name: clerk.user.fullName || clerk.user.username || 'User',
        email: clerk.user.primaryEmailAddress?.emailAddress
      }));

    } else {
      // User is logged out
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      authLi.innerHTML = `
        <a href="login.html" class="nav_items">Login</a>
      `;
      
      const cartLi = navList.querySelector('a[href="cart.html"]')?.parentElement || navList.querySelector('.cart')?.parentElement;
      if (cartLi) {
        navList.insertBefore(authLi, cartLi);
      } else {
        navList.appendChild(authLi);
      }
    }
  } catch (err) {
    console.error("Clerk updateNavbarAuth error:", err);
  }
}

// Retrieve Clerk Session Token asynchronously (handles auto-refreshing expired tokens)
async function getClerkToken() {
  try {
    const clerk = await initClerk();
    if (clerk.session) {
      const token = await clerk.session.getToken();
      localStorage.setItem('token', token);
      return token;
    }
  } catch (err) {
    console.error("Error retrieving Clerk token:", err);
  }
  return localStorage.getItem('token');
}

// Export functions to global scope
window.initClerk = initClerk;
window.getClerkToken = getClerkToken;

// Run navbar update immediately on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateNavbarAuth);
} else {
  updateNavbarAuth();
}
