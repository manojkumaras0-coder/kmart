# Supabase Setup Guide for KMart

## Step 1: Create Supabase Account & Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up** for a free account (or sign in if you have one)
3. **Create a new project**:
   - Click "New Project"
   - Organization: Select or create one
   - Name: `kmart-grocery` (or any name you prefer)
   - Database Password: Create a strong password (save this!)
   - Region: Choose closest to you
   - Click "Create new project"
   - Wait 2-3 minutes for setup to complete

---

## Step 2: Get Your Credentials

1. **Go to Project Settings** (gear icon in sidebar)
2. **Click on "API"** in the left menu
3. **Copy these values**:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

---

## Step 3: Update Backend .env File

1. Open `e:\AntiGravity\KMart\backend\.env`
2. Update these lines with your credentials:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key-here
```

3. Save the file

---

## Step 4: Run Database Schema

1. **In Supabase Dashboard**, click **SQL Editor** (in sidebar)
2. **Click "New query"**
3. **Copy the entire contents** of `backend/database/schema.sql`
4. **Paste into the SQL editor**
5. **Click "Run"** (or press Ctrl+Enter)
6. You should see: ✓ Success. No rows returned

---

## Step 5: Add Sample Data

1. **Still in SQL Editor**, create a **new query**
2. **Copy the contents** of `backend/database/sample-data.sql`
3. **Paste and Run**
4. You should see: ✓ Success

---

## Step 6: Verify Data

1. **Click "Table Editor"** in sidebar
2. You should see these tables:
   - users
   - products
   - categories
   - cart
   - orders
   - order_items
   - addresses
   - reviews

3. **Click on "products"** - you should see sample products
4. **Click on "categories"** - you should see sample categories

---

## Step 7: Restart Backend Server

1. **Stop the backend server** (Ctrl+C in the terminal)
2. **Restart it**:
   ```bash
   cd backend
   npm run dev
   ```

3. You should now see:
   ```
   ✅ Supabase client initialized
   🚀 KMart API Server running on port 5000
   ```

---

## Step 8: Test the API

### Test Products Endpoint

Open your browser or Postman and try:

```
GET http://localhost:5000/api/products
```

You should get a JSON response with sample products!

### Test Categories

```
GET http://localhost:5000/api/products/categories
```

### Test Search

```
GET http://localhost:5000/api/products?search=apple
```

---

## Step 9: Start Frontend and Test

1. **Open a new terminal**
2. **Start the frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open browser** to `http://localhost:5173`
4. **Login or Register** a new account
5. **Click "Products"** in navigation
6. **You should see** the sample products!

---

## Troubleshooting

### Backend won't start
- Check that SUPABASE_URL and SUPABASE_KEY are correct in `.env`
- Make sure there are no extra spaces in the values

### No products showing
- Verify sample data was inserted (check Table Editor in Supabase)
- Check browser console for errors (F12)
- Check backend terminal for errors

### Authentication errors
- Make sure you've registered a user account
- Check that JWT_SECRET is set in backend `.env`

---

## Next Steps

Once Supabase is set up and working:
1. ✅ Test product listing
2. ✅ Test product search
3. ✅ Test category filtering
4. ✅ Test product details page
5. Move to Phase 3: Shopping Cart

---

## Quick Reference

**Supabase Dashboard**: https://app.supabase.com
**Backend API**: http://localhost:5000/api
**Frontend**: http://localhost:5173

**Key Files**:
- Schema: `backend/database/schema.sql`
- Sample Data: `backend/database/sample-data.sql`
- Backend Config: `backend/.env`
