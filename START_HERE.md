# 🚀 Quick Start Guide - Fix All Common Issues

## ⚡ Fast Setup (3 Steps)

### Step 1: Check Setup
```bash
cd Stock_market/stock_market/server
npm install
npm run check
```

This will:
- ✅ Check if MongoDB is connected
- ✅ Create .env file if missing
- ✅ Test all connections
- ✅ Show you exactly what's wrong

### Step 2: Start Backend
```bash
npm start
```

You should see:
- ✅ MongoDB Connected Successfully
- ✅ Server is running on port 5000

### Step 3: Start Frontend
Open a NEW terminal:
```bash
cd Stock_market/stock_market
npm start
```

## 🔧 Fixing Common Issues

### Issue 1: "Cannot connect to server"

**Solution:**
1. Make sure backend is running:
   ```bash
   cd Stock_market/stock_market/server
   npm start
   ```

2. Check if port 5000 is available:
   - Windows: `netstat -ano | findstr :5000`
   - Mac/Linux: `lsof -i :5000`

3. Test the server:
   - Open browser: http://localhost:5000/api/health
   - Should show: `{"status":"Server is running",...}`

### Issue 2: "MongoDB Connection Error"

**Solution A: Local MongoDB (Windows)**
```bash
# Option 1: Start MongoDB Service
# Press Win+R, type: services.msc
# Find "MongoDB" → Right-click → Start

# Option 2: Command Line
net start MongoDB

# Option 3: Manual Start
mongod --dbpath "C:\data\db"
```

**Solution B: Local MongoDB (Mac/Linux)**
```bash
# Start MongoDB
mongod

# Or if installed via Homebrew
brew services start mongodb-community
```

**Solution C: MongoDB Atlas (Cloud - Recommended)**
1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create a cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Update `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gym_management
   ```
7. Click "Network Access" → "Add IP Address" → "Allow Access from Anywhere"

### Issue 3: "User already exists"

**This is GOOD!** It means registration is working. Just use a different email.

### Issue 4: Port Already in Use

**Solution:**
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux - Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in server/.env
PORT=5001
```

## 🧪 Testing Everything

### Test 1: MongoDB Connection
```bash
cd Stock_market/stock_market/server
npm run test-connection
```

### Test 2: Server Health
Open browser: http://localhost:5000/api/health

Should show:
```json
{
  "status": "Server is running",
  "mongodb": "connected",
  "mongodbReady": true
}
```

### Test 3: Full Setup Check
```bash
npm run check
```

## 📋 Complete Setup Checklist

- [ ] Node.js installed (v14+)
- [ ] MongoDB installed OR Atlas account created
- [ ] Backend dependencies installed (`npm install` in server folder)
- [ ] Frontend dependencies installed (`npm install` in root folder)
- [ ] MongoDB running (local) OR Atlas connection string set
- [ ] Backend server running (`npm start` in server folder)
- [ ] Frontend running (`npm start` in root folder)
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:5000/api/health

## 🆘 Still Having Issues?

1. **Check Backend Terminal:**
   - Look for error messages
   - Should see "MongoDB Connected Successfully"

2. **Check Browser Console (F12):**
   - Look for network errors
   - Check if API calls are failing

3. **Check .env File:**
   ```bash
   cd Stock_market/stock_market/server
   cat .env
   ```

4. **Run Setup Checker:**
   ```bash
   npm run check
   ```

## ✅ Success Indicators

When everything is working:
- ✅ Backend shows: "MongoDB Connected Successfully"
- ✅ Backend shows: "Server is running on port 5000"
- ✅ http://localhost:5000/api/health shows mongodb: "connected"
- ✅ Registration form works without errors
- ✅ You can create an account successfully

---

**Need Help?** Check the error message - it now tells you exactly what's wrong and how to fix it!



