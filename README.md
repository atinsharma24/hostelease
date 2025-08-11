# 🏢 HostelEase - Complete MERN Stack Hostel Management System

![HostelEase Banner](https://img.shields.io/badge/HostelEase-MERN%20Stack-blue?style=for-the-badge&logo=mongodb&logoColor=white)

Welcome to **HostelEase**, your comprehensive solution for seamless hostel living experience. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js), this application provides a modern, scalable, and user-friendly platform for hostel management.

## 🌟 Features

### 🔐 **Authentication & User Management**
- Secure user registration and login with JWT tokens
- Role-based access control (Student, Staff, Admin)
- Password encryption with bcrypt
- User profile management

### 🏠 **Core Services**
- **Room Allocation:** Streamlined room assignment system
- **Maintenance Requests:** Track complaints and service requests
- **Laundry Services:** Schedule and monitor laundry pickups
- **Cleaning Services:** Request room and common area cleaning
- **Electrical Services:** Report electrical issues
- **Carpenter Services:** Request repair and maintenance
- **WiFi Support:** Submit connectivity complaints
- **Mess Complaints:** Food quality and service feedback

### 📊 **Dashboard & Analytics**
- Real-time service request tracking
- Interactive statistics and charts
- Admin dashboard with comprehensive insights
- User activity monitoring

### 📱 **Modern UI/UX**
- Responsive Material-UI design
- Mobile-first approach
- Intuitive navigation
- Real-time notifications

## 🚀 Tech Stack

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### **Frontend**
- **React.js** - UI library
- **React Router** - Client-side routing
- **Material-UI** - Component library
- **Axios** - HTTP client
- **Vite** - Build tool

### **Database Design**
- **User Management:** Comprehensive user profiles with role-based access
- **Service Requests:** Flexible schema supporting all service types
- **Real-time Updates:** Efficient data indexing and queries

## 📁 Project Structure

```
HostelEase/
├── backend/                 # Backend API server
│   ├── models/             # Database models
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication & validation
│   ├── config/             # Configuration files
│   ├── server.js           # Main server file
│   └── seed.js             # Database seeding script
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── utils/          # Utility functions
│   │   └── assets/         # Static assets
│   ├── index.html          # Main HTML file
│   └── package.json        # Frontend dependencies
└── README.md               # Project documentation
```

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn package manager

### **Backend Setup**

1. **Clone the repository**
```bash
   git clone https://github.com/atinsharma24/HostelEase.git
cd HostelEase/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
# Create config.env file
cp config.env.example config.env

# Update with your configuration
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hostelease
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### **Frontend Setup**

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
   npm install
```

3. **Start development server**
```bash
npm run dev
```

### **Database Setup**

1. **Start MongoDB**
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
```

2. **Seed the database**
```bash
cd backend
node seed.js
```

## 🔑 Default Login Credentials

After running the seed script, you can use these accounts:

| Role | Email | Password |
|------|-------|----------|
| 👑 **Admin** | admin@hostelease.com | admin123 |
| 👷 **Staff** | staff@hostelease.com | staff123 |
| 👨‍🎓 **Student 1** | john@example.com | student123 |
| 👩‍🎓 **Student 2** | jane@example.com | student123 |

## 📡 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile
- `POST /api/auth/logout` - User logout

### **Services**
- `POST /api/services` - Create service request
- `GET /api/services/my-requests` - Get user's requests
- `GET /api/services/:id` - Get specific request
- `PUT /api/services/:id/status` - Update request status
- `POST /api/services/:id/feedback` - Add feedback

### **Admin**
- `GET /api/admin/users` - Get all users
- `GET /api/admin/requests` - Get all service requests
- `GET /api/admin/dashboard` - Admin dashboard stats
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

## 🎨 Key Components

### **Backend Architecture**
- **MVC Pattern:** Clean separation of concerns
- **Middleware:** Authentication, validation, error handling
- **RESTful API:** Standard HTTP methods and status codes
- **Data Validation:** Mongoose schema validation
- **Error Handling:** Centralized error management

### **Frontend Architecture**
- **Component-Based:** Reusable UI components
- **Context API:** Global state management
- **Protected Routes:** Role-based access control
- **Responsive Design:** Mobile-first approach
- **Material Design:** Consistent UI/UX

## 🚀 Deployment

### **Backend Deployment**
```bash
# Build for production
npm run build

# Deploy to your preferred platform
# (Heroku, DigitalOcean, AWS, etc.)
```

### **Frontend Deployment**
```bash
# Build for production
npm run build

# Deploy to Vercel, Netlify, or your preferred platform
```

## 🔒 Security Features

- **JWT Authentication:** Secure token-based authentication
- **Password Hashing:** bcrypt encryption for passwords
- **Role-Based Access:** Granular permission system
- **Input Validation:** Server-side data validation
- **CORS Protection:** Cross-origin request handling
- **Environment Variables:** Secure configuration management

## 📱 Responsive Design

- **Mobile-First:** Optimized for mobile devices
- **Progressive Web App:** Modern web app features
- **Touch-Friendly:** Optimized for touch interactions
- **Cross-Platform:** Works on all devices and browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Material-UI** for the beautiful component library
- **MongoDB** for the robust database solution
- **Express.js** for the powerful web framework
- **React.js** for the amazing frontend library

## 📞 Support

For support and questions:
- 📧 Email: atinsharma@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/atinsharma24/HostelEase/issues)
- 📖 Documentation: Check the code comments and API documentation

---

🌟 **Thank you for choosing HostelEase!** We hope this platform makes your hostel living experience more enjoyable and efficient. 🚀

**Built with ❤️ by Atin Sharma**

