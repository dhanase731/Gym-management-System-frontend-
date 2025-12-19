# Gym Management System - Setup Guide

This is a full-stack gym management system built with React (frontend), Node.js, Express.js (backend), and MongoDB (database).

## Features

- ✅ User Authentication (Login/Sign Up)
- ✅ Members Management (CRUD operations with MongoDB)
- ✅ Gym Management (Add gyms, view all gyms)
- ✅ Billing & Invoicing (Generate invoices, send payment reminders)
- ✅ Settings Management (Save to MongoDB)
- ✅ Email notifications for payment reminders

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation Steps

### 1. Install Frontend Dependencies

```bash
cd Stock_market/stock_market
npm install
```

### 2. Install Backend Dependencies

```bash
cd Stock_market/stock_market/server
npm install
```

### 3. MongoDB Setup

#### Option A: Local MongoDB
- Install MongoDB locally
- Make sure MongoDB service is running
- Default connection: `mongodb://localhost:27017/gym_management`

#### Option B: MongoDB Atlas (Cloud)
- Create a free account at https://www.mongodb.com/cloud/atlas
- Create a cluster and get your connection string
- Update the connection string in `server/.env`

### 4. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb://localhost:27017/gym_management
PORT=5000
JWT_SECRET=your_secret_key_change_in_production
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Create a `.env` file in the frontend root (`Stock_market/stock_market`) to point the React app at the backend (this repository already contains a `.env` with the default value):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Note:** For email functionality:
- Use Gmail with App Password (not regular password)
- Enable 2-factor authentication
- Generate App Password from Google Account settings

### 5. Backend removed from this repository

This repository no longer contains the backend server. If you want to run the full application you can:

- Use an external backend (hosted or local) that exposes the same API endpoints at the URL set in `REACT_APP_API_URL`.
- Restore the backend from `server-backup.zip` located in the frontend root if needed.

### 6. Start the Frontend

Open a new terminal:

```bash
cd Stock_market/stock_market
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

1. **Sign Up**: Create a new account at `/signup`
2. **Login**: Login with your credentials at `/login`
3. **Add Gyms**: Go to Gyms section and add new gyms
4. **Add Members**: Go to Members section and add members
5. **Create Bills**: Go to Billing section and create bills for members
6. **Generate Invoices**: Click "Invoice" button on any bill to generate and print invoice
7. **Send Reminders**: Click "Remind" button to send email reminders
8. **Settings**: Configure system settings in Settings page

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Members
- `GET /api/members` - Get all members
- `POST /api/members` - Create member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Gyms
- `GET /api/gyms` - Get all gyms
- `POST /api/gyms` - Create gym
- `PUT /api/gyms/:id` - Update gym
- `DELETE /api/gyms/:id` - Delete gym

### Billing
- `GET /api/billing` - Get all bills
- `POST /api/billing` - Create bill
- `POST /api/billing/generate-invoice/:id` - Generate invoice
- `POST /api/billing/send-reminder/:id` - Send payment reminder
- `PUT /api/billing/:id` - Update bill status

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings

## Project Structure

```
Stock_market/stock_market/
├── server/                 # Backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── server.js          # Express server
│   └── package.json
├── src/                   # Frontend
│   ├── pages/             # Page components
│   ├── components/        # Reusable components
│   ├── utils/             # Utilities (API calls)
│   └── App.js
└── package.json
```

## Troubleshooting

1. **MongoDB Connection Error**: 
   - Check if MongoDB is running
   - Verify connection string in `.env`

2. **Email Not Sending**:
   - Check email credentials in `.env`
   - Use App Password for Gmail
   - Check spam folder

3. **CORS Errors**:
   - Ensure backend is running on port 5000
   - Check `cors` middleware in `server.js`

4. **Port Already in Use**:
   - Change PORT in `.env` file
   - Or kill the process using the port

## Development

For development with auto-reload:

```bash
# Backend (with nodemon)
cd server
npm run dev

# Frontend (already has hot-reload)
cd ..
npm start
```

## Notes

- All data is stored in MongoDB
- New gyms are automatically reflected in the webpage
- When adding a gym, the creator's name is stored and shown in billing
- Invoice generation creates a printable invoice
- Email reminders are sent to member's email address



