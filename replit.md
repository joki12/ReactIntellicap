# Overview

This is a full-stack web application for Fondation Intellcap, a foundation supporting innovation and education through mentorship, workspace, and funding for entrepreneurs and students. The platform provides public access to foundation information, user registration for activities, donation management, and comprehensive admin functionality. Built with React.js frontend, Express.js backend, PostgreSQL database, and modern component libraries.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built as a Single Page Application (SPA) using React with TypeScript, leveraging modern React patterns and hooks. The application uses Wouter for client-side routing instead of React Router, providing a lightweight routing solution. State management is handled through React Context API for authentication and language preferences, with TanStack Query for server state management and caching.

The UI is built with shadcn/ui components, providing a consistent design system built on top of Radix UI primitives. Styling is implemented with Tailwind CSS using a custom design system with CSS variables for theming. The component architecture follows a modular approach with reusable components for common patterns like cards, modals, and forms.

## Backend Architecture  
The backend follows a RESTful API design using Express.js with TypeScript. The server implements middleware for authentication using JWT tokens, request logging, and error handling. The API structure is organized with dedicated route handlers and a clean separation between routing logic and data operations.

Session management is handled through JWT tokens stored in localStorage on the client side, with middleware to verify tokens and extract user information for protected routes. The backend includes role-based access control with admin and user roles.

## Data Storage Solutions
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The database connection is configured to work with Neon Database serverless PostgreSQL. Database schema is defined using Drizzle's schema definition with proper TypeScript integration.

The schema includes comprehensive tables for users, projects, activities, participations, donations, space requests, and contact messages. All tables use UUID primary keys and include proper foreign key relationships and constraints.

## Authentication and Authorization
Authentication is implemented using JWT tokens with bcrypt for password hashing. The system supports user registration, login, and role-based access control. Protected routes are secured through middleware that validates JWT tokens and extracts user information.

The authentication flow includes login/register modals, persistent sessions through localStorage, and automatic redirection for unauthorized access. Admin functionality is protected through role-based middleware that checks for admin privileges.

## External Dependencies

- **Database**: PostgreSQL (Neon Database serverless)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **UI Components**: Radix UI primitives via shadcn/ui
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state
- **Authentication**: JWT with bcrypt password hashing
- **Build Tools**: Vite for frontend bundling, esbuild for backend
- **Development**: TypeScript, ESM modules
- **Email**: Planned Nodemailer integration (referenced in attached assets)
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns for date manipulation