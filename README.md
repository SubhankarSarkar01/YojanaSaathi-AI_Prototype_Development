# YojanaSaathi AI - Government Scheme Portal

A comprehensive platform for citizens to discover, apply for, and track government schemes.

## Features Implemented

### ✅ User Authentication
- Register with email/mobile and password
- Login with credentials
- JWT-based authentication
- Password reset functionality
- User-specific sessions

### ✅ User Profiles
- Create and manage personal profiles
- Profile completeness tracking
- User-specific data isolation
- Each user has their own profile

### ✅ Scheme Management
- Browse 5 government schemes
- Search and filter schemes
- Multi-language support (English/Hindi)
- View scheme details
- Category-based organization

### ✅ Application System
- Apply for schemes with "Apply Now" button
- User-specific applications
- Track application status
- View application history
- Each user sees only their own applications

### ✅ Admin Panel
- Admin role-based access
- Add new schemes from government websites
- Edit existing schemes
- Delete schemes
- View all applications
- View all users
- Dashboard with statistics

## Tech Stack

### Backend
- Node.js + Express + TypeScript
- MySQL database
- TypeORM for database management
- JWT for authentication
- Bcrypt for password hashing

### Frontend
- React 18 + TypeScript
- Vite build tool
- Tailwind CSS
- React Router v6
- Zustand state management
- Axios for API calls
- i18next for multi-language

## Getting Started

### Prerequisites
- Node.js 16+
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd YojanaSaathi
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Setup MySQL Database**
```bash
# Create database
mysql -u root -p
CREATE DATABASE yojanasaathi;
exit
```

4. **Configure Environment**

Backend `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=yojanasaathi
JWT_SECRET=your-secret-key
PORT=3000
```

Frontend `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

5. **Start the Application**

```bash
# Start backend (from backend folder)
cd backend
npm run dev

# Start frontend (from frontend folder)
cd frontend
npm run dev
```

6. **Access the Application**
- Frontend: http://localhost:5174
- Backend API: http://localhost:3000/api

## Usage

### For Users

1. **Register/Login**
   - Go to http://localhost:5174/auth
   - Register with email and password
   - Login with credentials

2. **Create Profile**
   - After registration, create your profile
   - Fill in personal, location, economic, and family details

3. **Browse Schemes**
   - Go to Schemes page
   - Search and filter schemes
   - View scheme details

4. **Apply for Schemes**
   - Click "Apply Now" on any scheme
   - Submit application
   - Track application status in Applications page

### For Admins

1. **Create Admin User**
```bash
# Connect to MySQL
mysql -u root -p yojanasaathi

# Update a user to admin
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

2. **Login as Admin**
   - Login with admin credentials
   - Access admin panel

3. **Manage Schemes**
   - Add new schemes from government websites
   - Edit existing schemes
   - Delete schemes
   - View all applications

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### Schemes
- `GET /api/schemes` - Get all schemes
- `GET /api/schemes/:id` - Get scheme details

### Profile
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Create profile
- `PUT /api/profile` - Update profile

### Applications
- `GET /api/applications` - Get user applications
- `POST /api/applications` - Create application
- `GET /api/applications/:id` - Get application details

### Admin (Requires admin role)
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/schemes` - Get all schemes
- `POST /api/admin/schemes` - Create new scheme
- `PUT /api/admin/schemes/:id` - Update scheme
- `DELETE /api/admin/schemes/:id` - Delete scheme
- `GET /api/admin/applications` - Get all applications
- `GET /api/admin/users` - Get all users

## Database Schema

### Users
- user_id (UUID)
- email
- password_hash
- full_name
- mobile_number
- role (user/admin)
- created_at
- updated_at

### Profiles
- profile_id (UUID)
- user_id (FK)
- date_of_birth
- gender
- state, district, pin_code
- category
- occupation
- annual_income
- family_size
- education_qualification
- profile_completeness

### Schemes
- scheme_id (UUID)
- scheme_code
- name_en, name_hi, name_ta, name_te, name_bn
- description_en, description_hi
- category
- level
- department
- benefit_amount
- deadline
- is_ongoing
- created_at

### Applications
- application_id (UUID)
- user_id (FK)
- scheme_id (FK)
- status
- completion_percentage
- submitted_at
- created_at

## Key Features

### User Isolation
- Each user has their own profile
- Users see only their own applications
- Profile data is isolated per user
- Applications are linked to specific users

### Admin Capabilities
- Add schemes from government websites
- Manage all schemes
- View all applications
- View all users
- Dashboard with statistics

### Security
- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Protected routes
- Input validation

## Project Structure

```
YojanaSaathi/
├── backend/
│   ├── src/
│   │   ├── config/         # Database, Redis config
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, error, rate limit
│   │   ├── models/         # TypeORM entities
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   └── server.ts       # Main server file
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand stores
│   │   ├── lib/            # API client
│   │   └── main.tsx        # Entry point
│   ├── .env
│   └── package.json
├── database/
│   └── mysql/              # SQL migration files
├── README.md
└── IMPLEMENTATION_PLAN.md
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.
