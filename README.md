# School Management System

A comprehensive school management system built with the MERN stack that handles digital payments, meal bookings, and event registrations.

## Features

- User Authentication & Role Management
- Digital Wallet System
- Meal Booking & Token System
- Vendor Management
- Event & Hackathon Registration
- Secure Payment Processing
- Analytics Dashboard

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **Authentication:** JWT + OAuth
- **Payment Integration:** (To be configured)

## Project Structure

```
.
├── client/                 # React frontend
├── server/                 # Node.js backend
├── package.json           # Root package.json
└── README.md             # This file
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client && npm install
   
   # Install server dependencies
   cd ../server && npm install
   ```

3. Set up environment variables:
   - Create `.env` file in server directory
   - Create `.env` file in client directory

4. Start the development servers:
   ```bash
   # Start backend server
   cd server && npm run dev
   
   # Start frontend server (in another terminal)
   cd client && npm start
   ```

## Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Client (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## License

MIT
