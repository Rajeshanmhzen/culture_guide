# Cultural Guide

A full-stack web application for exploring and discovering cultural heritage locations with user authentication, location management, and review system.

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Redux Toolkit, React Router
- **Backend**: Node.js, Express.js, MongoDB, JWT Authentication
- **File Upload**: Multer for image handling
- **Database**: MongoDB with Mongoose ODM

## 📁 Project Structure

```
cultural_guide/
├── backend/          # Express.js API server
├── frontend/         # React application
└── README.md         # This file
```

## 🛠️ Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd cultural_guide
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm start
```

3. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## 🔧 Environment Variables

Create `.env` files in both backend and frontend directories. See respective README files for detailed configuration.

## 📚 Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.