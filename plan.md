# OpenPoll Implementation Plan

This document outlines the lean implementation plan for building OpenPoll using Next.js, TypeScript, Tailwind CSS, and Prisma with PostgreSQL.

## 1. Technology Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS (Pages Router)
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with custom configuration

## 2. Project Structure

poll-app/
├── src/                    # Source directory
│   ├── pages/              # Next.js pages router
│   │   ├── index.tsx       # Home page with poll entry
│   │   ├── admin/          # Admin routes (password protected)
│   │   ├── poll/           # Public poll routes
│   │   └── api/            # API routes
│   ├── components/         # Reusable components
│   │   ├── layout/         # Layout components
│   │   ├── ui/             # UI components
│   │   └── polls/          # Poll-specific components
│   ├── lib/                # Utility functions and shared code
│   └── styles/             # Global styles
├── prisma/                 # Prisma schema and migrations
└── public/                 # Static assets

## 3. Database Schema (Prisma)

```prisma
// schema.prisma
model Poll {
  id             String     @id @default(cuid())
  code           String     @unique // Unique code for sharing (e.g., PROD24)
  question       String
  status         PollStatus @default(ACTIVE)
  createdAt      DateTime   @default(now())
  closedAt       DateTime?
  responses      Response[]
  wordCloud      Json?      // Store word frequencies when poll is closed
  aiSummary      String?    @db.Text
}

enum PollStatus {
  ACTIVE
  CLOSED
}

model Response {
  id             String    @id @default(cuid())
  text           String    @db.Text
  createdAt      DateTime  @default(now())
  pollId         String
  poll           Poll      @relation(fields: [pollId], references: [id])
}
```

## 4. Component Organization

### Layout Components
- `Layout` - Main application wrapper with common elements
- `PageContainer` - Consistent page padding and margin control
- `AdminHeader` - Header with logo and navigation for admin pages

### UI Components
- `Button` - Reusable button with variants (primary, secondary, outline)
- `Badge` - Status indicators (active, closed)
- `TabNavigation` - Tab switching component for poll details
- `Card` - Generic container component with variants
- `TextArea` - Expandable text input for poll questions and responses
- `Input` - Form input with icon support
- `Table` - Data table for displaying polls list
- `WordCloud` - Visual representation of word frequencies
- `Modal` - Popup dialog for creating polls and confirmations

### Poll Components
- `PollHeader` - Displays poll question, status, code and metadata
- `ResponseCard` - Individual response display with timestamp
- `PollForm` - Form for creating/editing polls
- `PollList` - Table of polls for admin dashboard
- `PollCodeEntry` - Form for entering poll access code
- `AdminLoginForm` - Form for admin authentication
- `SummaryCard` - Card containing word cloud and AI summary
- `ResponsesList` - Container for displaying poll responses

## 5. Page Routes

### Public Routes
- `/` - Home page with poll entry form or admin login
- `/poll/[code]` - User view to answer a poll or see summary if closed

### Admin Routes (Password Protected)
- `/admin/polls` - Admin dashboard showing polls list
- `/admin/polls/[id]` - Poll management page

## 6. API Endpoints

### Admin Endpoints (Protected)
- `POST /api/admin/login` - Authenticate admin
- `GET /api/admin/polls` - Get all polls (admin only)
- `POST /api/admin/polls` - Create new poll
- `GET /api/admin/polls/[id]` - Get poll details by id
- `POST /api/admin/polls/[id]/close` - Close a poll

### Public Endpoints
- `GET /api/polls/[code]` - Get poll details by code
- `POST /api/polls/[code]/responses` - Submit a response to a poll

## 7. Authentication Strategy

1. Simple password protection for admin area
2. Store admin password in environment variables
3. Use HTTP-only cookies for admin session
4. No authentication required for submitting responses to polls

## 8. Implementation Phases

### Phase 1: Setup and Foundations
1. ✅ Configure Next.js with TypeScript and Tailwind CSS
2. Set up Prisma with PostgreSQL
3. Create database schema and initial migration
4. Implement basic UI components

### Phase 2: Core Poll Functionality
1. Create poll creation functionality
2. Implement poll response submission
3. Develop poll response viewing
4. Build admin polls list
5. Implement unique code generation for polls

### Phase 3: Essential Features
1. Implement poll closing functionality
2. Add word cloud generation
3. Implement AI summary generation
4. Build summary views for closed polls
5. Set up simple admin password protection

### Phase 4: Polish and Testing
1. Add responsive design improvements
2. Implement loading states and error handling
3. Add data export functionality
4. Testing and bug fixes

## 9. Additional Considerations

### Word Cloud Generation
- Process response text to extract and count word frequencies
- Filter out common stop words
- Store word frequencies in the database when poll is closed
- Use client-side rendering to display the word cloud

### AI Summary Generation
- Implement OpenAI API integration to generate summaries of poll responses
- Process and analyze responses when a poll is closed
- Generate concise summary highlighting key trends and insights
- Store the generated summary in the database for future retrieval

### Code Generation
- Use unique random code generation for polls (6 characters)
- Combine letters and numbers for readability
- Ensure codes are easy to type and remember

### Responsive Design
- Ensure all UI components adapt to different screen sizes
- Optimize UI for both desktop and mobile devices
- Use Tailwind's responsive utility classes consistently