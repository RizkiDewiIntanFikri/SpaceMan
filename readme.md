# SpaceMan Trading Application

A modern, Revolut-inspired trading platform built with React and Node.js.

## Features

- **User Registration**: Simple username-based registration system
- **Portfolio Management**: Track your cash balance and portfolio value
- **Real-time Trading**: Buy and sell stocks with live market data
- **Leaderboard**: Compete with other traders
- **Modern UI**: Beautiful, responsive design inspired by Revolut

## Project Structure

```
SpaceMan/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Register.jsx  # User registration page
│   │   │   └── Home.jsx      # Main dashboard after login
│   │   ├── App.jsx        # Main application component
│   │   └── main.jsx       # Application entry point
│   └── package.json       # Frontend dependencies
├── server/                 # Node.js backend server
│   ├── controllers/       # API endpoint controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic services
│   └── app.js           # Server entry point
└── README.md             # This file
```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation & Setup

### 1. Backend Setup

```bash
cd SpaceMan/server

# Install dependencies
npm install

# Create .env file with the following content:
PORT=3000
JWT_SECRET=your-secret-key-here
INACTIVE_ALPHA_VANTAGE_API=false
ALPHA_VANTAGE_API=
RUN_PRICE_UPDATER=false

# Set up database (PostgreSQL must be running)
npm run db-reset

# Start the server
node app.js
```

The server will run on `http://localhost:3000`

### 2. Frontend Setup

```bash
cd SpaceMan/client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The client will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /register` - User registration
  - Body: `{ "username": "string" }`
  - Returns: User data and JWT token

### Protected Endpoints (require JWT token)
- `GET /portfolio` - Get user portfolio
- `GET /trades` - Get trading history
- `POST /trades` - Place trading order
- `GET /leaderboard` - Get leaderboard
- `GET /stocks/:symbol` - Get stock quote

## Usage

1. **Open the application** in your browser at `http://localhost:5173`
2. **Register a new account** by entering a username
3. **You'll be automatically logged in** and redirected to the home dashboard
4. **View your portfolio** with starting balance of $100,000
5. **Use the quick action buttons** to navigate to different features

## Design Features

- **Modern UI**: Clean, minimalist design inspired by Revolut
- **Responsive Layout**: Works on desktop and mobile devices
- **Glassmorphism**: Beautiful backdrop blur effects
- **Gradient Accents**: Subtle color gradients for visual appeal
- **Smooth Animations**: Hover effects and transitions
- **Icon Integration**: Lucide React icons for consistent design

## Technology Stack

### Frontend
- React 19
- Tailwind CSS 4
- Vite (build tool)
- Axios (HTTP client)
- React Router (routing)
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- Sequelize (ORM)
- PostgreSQL (database)
- JWT (authentication)
- Socket.io (real-time features)

## Database Schema

The application uses the following main tables:
- **Users**: User accounts with username and balance
- **Portfolios**: User investment portfolios
- **Stocks**: Available stocks for trading
- **Holdings**: User stock holdings
- **Trades**: Trading transaction history

## Security Features

- JWT-based authentication
- Protected API endpoints
- Input validation
- SQL injection protection (via Sequelize)
- CORS enabled for development

## Development

### Adding New Features
1. Create new components in `client/src/components/`
2. Add new API endpoints in `server/controllers/`
3. Update routes in `server/routes/route.js`
4. Test both frontend and backend

### Database Changes
1. Create new migration files using Sequelize CLI
2. Update models in `server/models/`
3. Run migrations: `npx sequelize-cli db:migrate`

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check database credentials in `config/config.json`
   - Verify database exists

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing processes: `pkill -f "node app.js"`

3. **CORS Issues**
   - Backend CORS is configured for development
   - Check browser console for errors

4. **JWT Token Issues**
   - Ensure JWT_SECRET is set in .env
   - Check token expiration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

---

**Note**: This is a development version. For production use, ensure proper security measures, environment variables, and database configurations are in place.
