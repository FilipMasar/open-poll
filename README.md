# OpenPoll

A simple open-ended polling application that allows users to create polls, collect responses, and view results with word clouds and AI summaries.

## Key Features

- Create polls with unique access codes
- Submit responses to active polls
- View results with word cloud visualization
- Admin interface for managing polls

## Tech Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM

## Getting Started

1. Clone the repository

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables in `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/openpoll"
   ADMIN_PASSWORD="your-secure-password"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to get started.

---

*Vibe coded in Cursor ✨*