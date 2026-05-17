# Fabrics by Yolanda — Backend Setup Guide

## Stack
- **Runtime:** Node.js + Express
- **Database + Auth:** Supabase (PostgreSQL)
- **Payments:** Paystack
- **Emails:** Nodemailer (Gmail)
- **Images:** Supabase Storage

---

## Step 1 — Install Dependencies
```bash
npm install
```

---

## Step 2 — Set Up Supabase

1. Go to **supabase.com** → Create a new project
2. Go to **SQL Editor** → paste the entire `supabase_schema.sql` file → click **Run**
3. Go to **Settings → API** → copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key (keep this private!)
4. Go to **Storage** → Create a new bucket called `product-images` → set it to **Public**

---

## Step 3 — Configure Environment
```bash
cp .env.example .env
# Then edit .env and fill in all values
```

---

## Step 4 — Set Up Paystack

1. Go to **dashboard.paystack.com** → Sign up/login
2. Go to **Settings → API Keys** → copy Test keys (use Live keys when ready)
3. Go to **Settings → Webhooks** → add: `https://yourdomain.com/api/payments/webhook`
4. Copy the webhook secret into your `.env`

---

## Step 5 — Set Up Gmail for Emails

1. Go to your Google Account → **Security → 2-Step Verification** (enable it)
2. Then go to **App Passwords** → create one for "Mail"
3. Use that 16-character password as `EMAIL_PASS` in your `.env`

---

## Step 6 — Make Yourself Admin

After registering your account on the site, run this in Supabase SQL editor:
```sql
UPDATE profiles SET role = 'admin' WHERE id = 'your-user-id-here';
```
Get your user ID from: Supabase → Authentication → Users

---

## Step 7 — Run the Server
```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ❌ | Create account |
| POST | /api/auth/login | ❌ | Login → get token |
| GET | /api/auth/me | ✅ | Get my profile |
| PUT | /api/auth/profile | ✅ | Update profile |
| POST | /api/auth/forgot-password | ❌ | Send reset email |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/products | ❌ | List products (filter, search, paginate) |
| GET | /api/products/featured | ❌ | Featured products |
| GET | /api/products/categories | ❌ | All categories |
| GET | /api/products/:slug | ❌ | Single product |
| POST | /api/products | 🔐 Admin | Create product |
| PUT | /api/products/:id | 🔐 Admin | Update product |
| DELETE | /api/products/:id | 🔐 Admin | Deactivate product |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/cart | ✅ | View cart |
| POST | /api/cart | ✅ | Add item |
| PUT | /api/cart/:id | ✅ | Update yards |
| DELETE | /api/cart/:id | ✅ | Remove item |
| DELETE | /api/cart | ✅ | Clear cart |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/orders | ✅ | Place order |
| GET | /api/orders | ✅ | My orders |
| GET | /api/orders/:id | ✅ | Single order |

### Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/payments/initialize | ✅ | Start Paystack payment |
| GET | /api/payments/verify/:ref | ✅ | Verify after redirect |
| POST | /api/payments/webhook | ❌ | Paystack webhook (auto) |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/admin/dashboard | 🔐 Admin | Stats overview |
| GET | /api/admin/orders | 🔐 Admin | All orders |
| PUT | /api/admin/orders/:id | 🔐 Admin | Update order status |
| GET | /api/admin/customers | 🔐 Admin | All customers |
| POST | /api/admin/upload-image | 🔐 Admin | Get image upload URL |

### Other
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/newsletter/subscribe | ❌ | Subscribe email |
| POST | /api/custom-orders | ❌ | Submit custom fabric request |

---

## Frontend Integration (How to use the token)

```javascript
// After login, save the token:
localStorage.setItem('token', response.data.token);

// Send it with every protected request:
const token = localStorage.getItem('token');
const res = await fetch('/api/cart', {
  headers: { Authorization: `Bearer ${token}` }
});
```

---

## Payment Flow (Frontend)

```
1. User fills checkout form
2. POST /api/orders  →  get order_id
3. POST /api/payments/initialize  →  get payment_url
4. Redirect user to payment_url (Paystack checkout)
5. User pays → Paystack redirects to your callback_url
6. GET /api/payments/verify/:reference  →  confirm payment
7. Show success page
```

---

## Deployment

### Backend → Railway.app
1. Push code to GitHub
2. railway.app → New Project → Deploy from GitHub
3. Add all .env variables in Railway dashboard
4. Railway gives you a URL like `https://fabrics-api.railway.app`

### Frontend → Vercel
1. Push frontend to GitHub
2. vercel.com → Import project
3. Set `FRONTEND_URL` in your backend .env to your Vercel URL

### Domain
- Buy `fabricsbyyolanda.com` from Namecheap (~$10/year)
- Point it to your Vercel frontend
- Point `api.fabricsbyyolanda.com` to your Railway backend
