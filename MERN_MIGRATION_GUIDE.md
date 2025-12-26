# MERN + Next.js TypeScript Migration Guide

This project has been migrated from Vite + React Router to MERN + Next.js with TypeScript.

## Architecture Overview

### Frontend
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React hooks + Server Actions
- **Authentication**: JWT with HTTP-only cookies

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt password hashing
- **API Style**: RESTful with Next.js route handlers

## Database Schema

### Users Collection
\`\`\`typescript
{
  _id: ObjectId
  email: string (unique, lowercase)
  password: string (hashed with bcrypt)
  name: string
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
}
\`\`\`

### Packages Collection
\`\`\`typescript
{
  _id: ObjectId
  name: string
  category: string
  description: string
  price: number
  features: string[]
  duration: number
  durationUnit: "hours" | "days" | "weeks" | "months"
  images: string[]
  createdAt: Date
  updatedAt: Date
}
\`\`\`

### Bookings Collection
\`\`\`typescript
{
  _id: ObjectId
  userId: ObjectId (ref: User)
  packageId: ObjectId (ref: Package)
  bookingDate: Date
  sessionDate: Date
  notes?: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  createdAt: Date
  updatedAt: Date
}
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (include role: "admin" for admin login)
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Packages
- `GET /api/packages` - Get all packages
- `GET /api/packages/[id]` - Get package by ID
- `POST /api/packages` - Create package (admin only)
- `PUT /api/packages/[id]` - Update package (admin only)
- `DELETE /api/packages/[id]` - Delete package (admin only)

### Bookings
- `GET /api/bookings` - Get user bookings (admin sees all)
- `POST /api/bookings` - Create booking (authenticated users only)

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or a MongoDB Atlas connection string

### Development Setup

1. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure environment variables**
   - Copy `.env.example` to `.env.local`
   - Update `MONGODB_URI` with your connection string
   - Change `JWT_SECRET` to a secure random string

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`
   
   The app will be available at `http://localhost:3000`

4. **Create admin user**
   - Register a user at `/register`
   - Manually update the user role in MongoDB:
     \`\`\`bash
     db.users.updateOne(
       { email: "your-email@example.com" },
       { $set: { role: "admin" } }
     )
     \`\`\`

### Production Deployment

1. **Build the project**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Start production server**
   \`\`\`bash
   npm start
   \`\`\`

3. **Environment Variables for Production**
   - Set a secure `JWT_SECRET`
   - Configure MongoDB Atlas or production MongoDB instance
   - Set `NEXT_PUBLIC_API_URL` to your production domain
   - Enable HTTPS

### Vercel Deployment

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy**

## Key Features

✅ User authentication with JWT
✅ Password hashing with bcrypt
✅ Role-based access control (admin/user)
✅ Protected routes with middleware
✅ MongoDB integration with Mongoose
✅ RESTful API with type safety
✅ Admin dashboard for package management
✅ Booking system
✅ Responsive UI with Tailwind CSS

## Migration Notes

### From Vite to Next.js
- Removed React Router dependency
- Replaced file-based routing with Next.js App Router
- Removed client-only context, moved to server components where possible
- API calls now use built-in Next.js API routes
- Environment variables follow Next.js naming conventions

### From localStorage to Database
- User sessions now use secure HTTP-only cookies
- All data is persisted in MongoDB
- Middleware handles authentication validation
- Server actions handle secure operations

## Common Development Tasks

### Add a new API endpoint
1. Create route file in `app/api/` folder
2. Export `GET`, `POST`, `PUT`, or `DELETE` functions
3. Use `getCurrentUser()` to get authenticated user

### Create a new page
1. Create folder structure in `app/` directory
2. Add `page.tsx` file
3. Use `"use client"` for client components
4. Import layout wrapper if needed

### Add MongoDB migration/seed
1. Create script in `scripts/` folder
2. Use `mongoose` to connect and modify data
3. Run script: `node scripts/script-name.js`

## Troubleshooting

### Authentication not working
- Check if `auth-token` cookie is being set
- Verify `JWT_SECRET` is set in environment
- Check browser DevTools > Application > Cookies

### Database connection failing
- Verify MongoDB is running
- Check `MONGODB_URI` is correct
- Ensure IP whitelist allows your connection (MongoDB Atlas)

### Admin login not working
- User must have `role: "admin"` in database
- Use MongoDB compass to check user role
- Ensure login includes `role: "admin"` in request body

## Useful Commands

\`\`\`bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npx tsc --noEmit
\`\`\`

## Dependencies

- `next` - React framework with API routes
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jose` - JWT handling
- `framer-motion` - Animations
- `@radix-ui/*` - Accessible UI components
- `tailwindcss` - Styling
- `zod` - Schema validation

## Security Best Practices

✅ Passwords hashed with bcrypt (10 salt rounds)
✅ JWT stored in HTTP-only cookies
✅ CSRF protection with SameSite cookies
✅ API routes verify authentication
✅ Role-based access control
✅ Input validation on API routes
✅ Secure headers via Next.js defaults

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Payment integration (Stripe)
- [ ] Image upload/storage
- [ ] Gallery management
- [ ] Booking calendar
- [ ] Email notifications
- [ ] Rate limiting on API routes
