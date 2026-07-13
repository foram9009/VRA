# Luxe Digital Agency Platform

Award-winning creative agency platform built with Next.js 15, React 19, Prisma, PostgreSQL, and modern animations/3D rendering. Fully production-ready, secure, and optimized for performance.

## 🛠 Tech Stack
- **Frontend**: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, GSAP, Framer Motion, React Three Fiber
- **Backend**: Next.js Route Handlers, Server Actions, Prisma ORM, PostgreSQL (Neon)
- **Auth & Security**: NextAuth v5, bcrypt, Zod validation, RBAC, Helmet-style headers
- **Media & Email**: Cloudinary, Resend
- **Deployment**: Vercel, Docker, GitHub Actions CI/CD

## 📦 Quick Start

### Prerequisites
- Node.js 20+
- npm or pnpm
- PostgreSQL instance (local or Neon)

### Installation
```bash
# Clone repository
git clone https://github.com/your-org/luxe-agency.git
cd luxe-agency

# Install dependencies
npm install

# Environment setup
cp .env.example .env.local
# Fill in DATABASE_URL, AUTH_SECRET, CLOUDINARY_*, RESEND_API_KEY

# Database setup
npx prisma generate
npx prisma db push
npm run db:seed

# Run development server
npm run dev
```*_
#production build
npm run build
npm start

#Testing
npm test          # Run unit & integration tests
npm run lint      # ESLint checks
npm run format    # Prettier formatting

#Vercel (recommended)
#Connect GitHub repo to Vercel
#Set environment variables in Vercel Dashboard
#Deploy main branch → Production, develop → Preview
#Docker
docker compose up -d
# App runs at http://localhost:3000
# DB accessible at localhost:5432

