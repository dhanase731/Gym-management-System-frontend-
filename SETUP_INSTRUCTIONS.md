# Quick Setup Guide - Fix Registration Issues

## Step 1: Install Backend Dependencies

```bash
cd Stock_market/stock_market/server
npm install
```

## Step 2: Start MongoDB

### Option A: Local MongoDB
Make sure MongoDB is installed and running:
```bash
# Windows (if installed as service, it should auto-start)
# Or start manually:
mongod
```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `server/.env` file with your connection string

## Step 3: Create .env File

Create a file `server/.env` with:
```
MONGODB_URI=mongodb://localhost:27017/gym_management
PORT=5000
JWT_SECRET=your_secret_key_change_in_production
```

## Step 4: Start Backend Server

```bash
cd Stock_market/stock_market/server
npm start
```

You should see:
- "MongoDB Connected Successfully"
- "Server is running on port 5000"

## Step 5: Start Frontend

Open a NEW terminal:
```bash
cd Stock_market/stock_market
npm start
```

## Step 6: Test Registration

1. Go to http://localhost:3000/signup
2. Fill in the form
3. Click "Sign Up"

## Troubleshooting

### Error: "Cannot connect to server"
- Make sure backend is running (check terminal)
- Check if port 5000 is available
- Try: http://localhost:5000/api/health (should return JSON)

### Error: "MongoDB Connection Error"
- Make sure MongoDB is running
- Check connection string in .env file
- For local MongoDB: `mongodb://localhost:27017/gym_management`
- For Atlas: Use your Atlas connection string

### Error: "User already exists"
- This means registration is working!
- Try with a different email address

### Still having issues?
1. Check browser console (F12) for errors
2. Check backend terminal for error messages
3. Make sure both servers are running



