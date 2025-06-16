# 🏦 Casca Clone

A modern loan application management system built with Next.js and Express.js that allows users to submit loan applications and administrators to manage them through an intuitive dashboard.

## ✨ Features

### 📝 Loan Application System
- **Smart Application Form**: Streamlined loan application process with business type selection
- **Amount Validation**: Intelligent input formatting with comma separators and $1M cap
- **Real-time Validation**: Client-side form validation for better UX

### 📊 Administrative Dashboard
- **Application Management**: View, review, and update loan application statuses
- **Interactive Modals**: Detailed application views with inline status updates
- **Historical Data**: Access to comprehensive loan history with pagination
- **Real-time Statistics**: Live metrics showing total applications, pending reviews, and amounts

### 🔧 Technical Features
- **Full-stack TypeScript**: Type-safe development across frontend and backend
- **Database Integration**: Prisma ORM with structured data models
- **Firebase Integration**: Cloud-based authentication and storage
- **Responsive Design**: Mobile-first design with modern CSS modules
- **Concurrent Development**: Single command to run both frontend and backend

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- **PostgreSQL database** (local or cloud instance)
- Firebase account (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd casca-clone
   ```

2. **Setup PostgreSQL Database**
   
   **Option A: Local PostgreSQL**
   ```bash
   # Install PostgreSQL (macOS with Homebrew)
   brew install postgresql
   brew services start postgresql
   
   # Create database
   createdb casca_clone_db
   ```
   
   **Option B: Cloud PostgreSQL (recommended)**
   - Use services like [Supabase](https://supabase.com), [Railway](https://railway.app), or [Neon](https://neon.tech)
   - Create a new PostgreSQL database
   - Copy the connection string

3. **Install all dependencies**
   ```bash
   npm run install:all
   ```

4. **Environment Setup**
   ```bash
   # Backend environment
   cp backend/.firebase.env.example backend/.firebase.env
   # Add your Firebase configuration
   
   # Database environment
   cd backend
   echo "DATABASE_URL=postgresql://username:password@localhost:5432/casca_clone_db" > .env
   # Replace with your actual database connection string
   ```

5. **Database Setup**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

6. **Start Development Servers**
   ```bash
   npm run dev
   ```

This will start both frontend (http://localhost:3000) and backend (http://localhost:4000) concurrently.


## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.8
- **Styling**: CSS Modules with modern design system
- **UI/UX**: Responsive design with modal interactions
- **Fonts**: Geist Sans & Mono from Vercel

### Backend
- **Runtime**: Node.js with Express.js 5
- **Language**: TypeScript 5.8
- **Database**: Prisma ORM 6.9
- **Authentication**: Firebase 11
- **Development**: ts-node-dev for hot reloading

### Development Tools
- **Concurrency**: Run frontend & backend simultaneously
- **Linting**: ESLint with Next.js configuration
- **Type Safety**: Full TypeScript coverage
- **Hot Reload**: Both frontend and backend support

## 📋 Available Scripts

### Root Level
```bash
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start only frontend (port 3000)
npm run dev:backend      # Start only backend (port 4000)
npm run install:all      # Install dependencies for all packages
npm run build           # Build frontend for production
```

### Frontend
```bash
cd frontend
npm run dev             # Development server with Turbopack
npm run build           # Production build
npm run start           # Start production server
npm run lint            # Run ESLint
```

### Backend
```bash
cd backend
npm run dev             # Development server with hot reload
npx prisma studio       # Open Prisma database GUI
npx prisma migrate dev  # Run database migrations
```

## 🎯 Usage

### For Applicants
1. Visit the application form at `/apply`
2. Fill out the loan application with:
   - Personal information (name, ID)
   - Business details and type
   - Loan amount (up to $1,000,000)
   - Purpose of the loan
3. Submit and receive confirmation

### For Administrators
1. Access the dashboard at `/dashboard`
2. View all applications with real-time statistics
3. Click on applicant names for detailed views
4. Update application statuses (Pending → Reviewing → Approved/Denied)
5. Access historical loan data for analysis

## 🔧 Configuration

### Environment Variables (Backend)
Create a `.firebase.env` file in the backend directory:
```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_domain
FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

### Database Schema
The application uses Prisma with models for:
- Loan applications with status tracking
- Historical loan data for analytics
- User management and authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

---

Built with ❤️ using Next.js, Express.js, and modern web technologies.


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
