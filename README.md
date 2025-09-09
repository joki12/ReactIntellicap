# React Intellicap - foundation Intellcap Platform

A comprehensive web platform for foundation Intellcap, built with modern technologies to manage projects, activities, donations, and community engagement.

## 🌟 Overview

Foundation Intellicap is a full-stack web application designed to empower innovation and education through technology. The platform serves as a central hub for managing projects, activities, donations, and community interactions for foundation Intellcap.

## 🚀 Features

### 👥 User Management
- User registration and authentication
- JWT-based secure login system
- Role-based access control (User/Admin)
- Profile management with editable information
- Password change functionality

### 📋 Project Management
- Create and manage innovation projects
- Project status tracking (Ongoing, Completed, Upcoming)
- Participant registration system
- Project categorization by domain
- Image upload support

### 🎯 Activity Management
- Workshop, hackathon, and training session management
- Activity registration with capacity limits
- Participant tracking and attendance
- Location and date management
- Activity type categorization

### 💰 Donation System
- Multiple donation types (Financial, Technical, Material)
- Secure donation form with validation
- Bank transfer information (RIB integration)
- Donation tracking and management
- Admin donation oversight

### 🖼️ Gallery Management
- Image upload and management
- Category-based organization
- Public gallery display
- Admin content management

### 📊 Admin Dashboard
- Comprehensive statistics overview
- User management and role assignment
- Content moderation and approval
- System configuration
- Analytics and reporting

### 🌐 Additional Features
- Multi-language support (French/English)
- Responsive design for all devices
- Real-time notifications
- File upload system
- Contact form and communication
- Space/mentorship request system

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **React Query** - Powerful data fetching and caching
- **Wouter** - Lightweight routing library
- **Lucide React** - Beautiful icon library

### Backend
- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Server-side type safety
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Database
- **SQLite** - Lightweight, file-based database
- **Drizzle ORM** - Type-safe SQL query builder
- **Better SQLite3** - High-performance SQLite driver

### Development Tools
- **ESBuild** - Fast JavaScript bundler
- **tsx** - TypeScript execution environment
- **Drizzle Kit** - Database migration tool
- **Vite Plugins** - Development enhancements

## 📁 Project Structure

```
ReactIntellicap/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── contexts/      # React context providers
│   │   ├── lib/           # Utility functions
│   │   └── assets/        # Static assets
│   ├── index.html         # Main HTML template
│   └── vite.config.ts     # Vite configuration
├── server/                # Backend Express server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   └── storage.ts        # Database operations
├── shared/                # Shared types and schemas
│   └── schema.ts         # Database schema and types
├── uploads/              # File upload directory
├── dist/                 # Build output
└── package.json          # Project dependencies
```

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts and authentication
- **projects** - Innovation projects and initiatives
- **activities** - Workshops, hackathons, and training sessions
- **participations** - User registrations for activities
- **donations** - Donation records and tracking
- **space_requests** - Room and mentorship requests
- **contacts** - Contact form submissions
- **gallery** - Image gallery management

### Key Relationships
- Users can participate in multiple activities
- Users can register for projects
- Activities have capacity limits and participant tracking
- Projects have status tracking and participant counts
- Donations are linked to users (optional)
- Gallery items support categorization

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ReactIntellicap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database setup**
   ```bash
   # Push database schema
   npm run db:push
   ```

4. **Development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

### Build for Production

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project (Admin)
- `PUT /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)
- `POST /api/projects/:id/register` - Register for project

### Activities
- `GET /api/activities` - List all activities
- `GET /api/activities/:id` - Get activity details
- `POST /api/activities` - Create activity (Admin)
- `POST /api/activities/:id/register` - Register for activity

### Donations
- `GET /api/donations` - List donations (Admin)
- `POST /api/donations` - Submit donation

### Admin
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id` - Update user
- `POST /api/admin/users/:id/promote` - Promote to admin

### Other
- `GET /api/stats` - Get platform statistics
- `GET /api/gallery` - Get gallery images
- `POST /api/upload` - Upload files


## 🎨 UI/UX Design

### Design System
- **Tailwind CSS** for consistent styling
- **Radix UI** for accessible components
- **Lucide React** for consistent iconography
- **Responsive design** for all screen sizes

### Key Components
- Navigation with user authentication status
- Project and activity cards with hover effects
- Modal dialogs for detailed views
- Form components with validation
- Toast notifications for user feedback
- Loading states and skeletons

## �️ **Setup on Another PC**

### Step-by-Step Setup

#### 1. **Copy Project Files**
```bash
# Option A: Clone from Git (if you have it on GitHub)
git clone https://github.com/yourusername/react-intellicap.git
cd react-intellicap

# Option B: Copy files manually
# Copy the entire project folder to your new PC
```

#### 2. **Install Dependencies**
```bash
npm install
```

#### 3. **Database Setup** (SQLite - No additional setup needed!)
The project uses **SQLite** which creates the database file automatically:
- Database file: `sqlite.db` (created in project root)
- No MySQL/XAMPP installation required!
- The database schema is defined in `shared/schema.ts`

#### 4. **Environment Configuration**
Create a `.env` file in the project root:

# Optional: Port configuration
PORT=5001
```



#### 5. **Initialize Database**
```bash
# Push database schema to SQLite
npm run db:push
```

#### 6. **Start the Development Server**
```bash
npm run dev
```

The app will be available at: `http://localhost:5001`

### 📁 **Project Structure for Transfer**
When copying to another PC, make sure to include:

**Essential Files:**
- All source code files (`src/`, `server/`, `shared/`, etc.)
- `package.json` and `package-lock.json`
- Configuration files (`vite.config.ts`, `tsconfig.json`, etc.)
- `.env` file (create new one with your secrets)

**Generated Files (will be created automatically):**
- `node_modules/` (reinstall with `npm install`)
- `sqlite.db` (database file - created by SQLite)
- `dist/` (build output)
- `uploads/` (for file uploads)

### 🚨 **Common Issues & Solutions**

#### Database Connection Issues
```bash
# If you get database errors, recreate the database:
rm sqlite.db
npm run db:push
```

#### Port Already in Use
```bash
# Kill process on port 5001
npx kill-port 5001
# Then run: npm run dev
```

#### Permission Issues (Windows)
- Run terminal as Administrator
- Or use Git Bash instead of Command Prompt

#### Node Version Issues
```bash
# Check Node version
node --version
# Should be 18+ for this project
```

### 🔧 **Development Commands**
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run check

# Database operations
npm run db:push
```

### 📊 **Database Management**
- **Database Type:** SQLite
- **File Location:** `./sqlite.db`
- **Schema:** `shared/schema.ts`
- **Migrations:** `drizzle-kit` handles schema updates

### 🌐 **Accessing the App**
- **Local Development:** `http://localhost:5001`
- **API Endpoints:** `http://localhost:5001/api/*`
- **File Uploads:** Stored in `uploads/` folder

### 🔒 **Security Notes**
- Change `JWT_SECRET` in `.env` to a secure random string
- Set a strong `ADMIN_SETUP_CODE`
- Never commit `.env` file to version control
- Keep `sqlite.db` secure (contains user data)

### 📞 **Need Help?**
If you encounter issues:
1. Check the terminal for error messages
2. Verify Node.js version: `node --version`
3. Ensure all dependencies are installed: `npm install`
4. Check if port 5001 is available
5. Look at the README deployment section for production setup

## 🚀 Deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for type safety
- Follow React best practices
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- foundation Intellcap for the vision and support
- Open source community for the amazing tools and libraries
- Contributors and maintainers

## 📞 Support

For support, email contact@intellcap.ma or create an issue in the repository.

---

**Built with ❤️ for foundation Intellcap**
