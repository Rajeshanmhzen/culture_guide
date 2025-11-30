# Cultural Guide Backend

Express.js REST API server for the Cultural Guide application with JWT authentication, file uploads, and MongoDB integration.

## 🚀 Features

- User authentication with JWT tokens
- Location management (CRUD operations)
- Image upload for heritage sites and user profiles
- Search functionality
- Review system
- Protected routes with middleware

## 📁 Project Structure

```
backend/
├── config/           # Database configuration
├── controllers/      # Route handlers
├── middleware/       # Authentication & file upload
├── models/          # MongoDB schemas
├── routes/          # API routes
├── uploads/         # File storage
├── utils/           # Helper functions
└── index.js         # Server entry point
```

## 🛠️ Installation

```bash
cd backend
npm install
```

## ⚙️ Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=8081
MONGODB_URI=mongodb://localhost:27017/cultural_guide
TOKEN_SECRET_KEY=your_jwt_secret_key
NODE_ENV=development
frontend_URL=http://localhost:5137
```

## 🚀 Running the Server

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/user/logout` - User logout
- `GET /api/user/profile` - Get user profile (Protected)

### Locations
- `GET /api/location/all` - Get all locations
- `POST /api/location/add` - Add new location (Protected)
- `PUT /api/location/update/:id` - Update location (Protected)
- `DELETE /api/location/delete/:id` - Delete location (Protected)
- `GET /api/location/:id` - Get location details

### Search
- `GET /api/search` - Search locations by query

## 🔐 Authentication

The API uses JWT tokens stored in HTTP-only cookies. Protected routes require valid authentication tokens.

### Middleware
- `authtoken.js` - JWT token verification
- `multer.js` - File upload handling
- `fileUpload.js` - File processing middleware

## 📊 Database Models

### User Model
- Email, password, name, profile picture
- Role-based access (admin/user)

### Location Model
- Name, description, images, coordinates
- Category, reviews, ratings

### Review Model
- User reference, location reference
- Rating, comment, timestamp

## 📁 File Upload

Images are stored in `/uploads` directory:
- Heritage site images: `/uploads/heritage-pic/`
- User profiles: `/uploads/user-profiles/`

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start
```

## 🐛 Error Handling

All API responses follow this format:
```json
{
  "message": "Response message",
  "data": [],
  "error": false,
  "success": true
}
```