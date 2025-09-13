# Career Counselor AI

A modern AI-powered career counseling chat application built with Next.js, TypeScript, tRPC, and Euron API.

## Features

- 🤖 AI-powered career counseling with GPT-4.1-nano
- 💬 Real-time chat interface with message history
- 👤 User authentication via Discord
- 📱 Responsive design for mobile and desktop
- 🔄 Session management with conversation persistence
- ⚡ Fast and optimized with TanStack Query

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: tRPC, NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Euron API (GPT-4.1-nano)
- **Styling**: Tailwind CSS with Heroicons

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Discord Developer Application
- Euron API token

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd career-ai
npm install
```

### 2. Environment Setup

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Fill in the following environment variables:

#### Discord Setup
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "OAuth2" → "General"
4. Copy the Client ID and Client Secret
5. Add them to your `.env` file

#### Euron API Setup
1. Go to [Euron Platform](https://euron.one)
2. Get your API token
3. Add it to your `.env` file as `EURON_API_TOKEN`

#### Database Setup
Set up a PostgreSQL database and add the connection URL to your `.env` file.

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/[...nextauth]/    # NextAuth API routes
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Main chat interface
│   └── _components/
│       ├── chat/                  # Chat components
│       │   ├── chat-app.tsx       # Main chat application
│       │   ├── chat-interface.tsx # Chat interface
│       │   ├── message-list.tsx   # Message display
│       │   ├── message-input.tsx  # Message input
│       │   └── empty-state.tsx    # Welcome screen
│       └── auth-button.tsx        # Authentication UI
├── server/
│   ├── api/
│   │   ├── root.ts                # tRPC root router
│   │   └── routers/
│   │       ├── chat.ts            # Chat operations
│   │       └── ai.ts              # AI operations
│   ├── auth/
│   │   ├── config.ts              # NextAuth configuration
│   │   └── index.ts               # Auth handlers
│   ├── ai.ts                      # Euron API integration
│   └── db.ts                      # Database connection
└── env.js                         # Environment validation
```

## API Routes

### Chat Router
- `createSession` - Create new chat session
- `getSessions` - Get user's chat sessions
- `getSession` - Get specific session with messages
- `getMessages` - Get paginated messages
- `updateSessionTitle` - Update session title
- `deleteSession` - Delete session

### AI Router
- `sendMessage` - Send message and get AI response
- `streamMessage` - Stream AI responses (future feature)

## Database Schema

```sql
-- Users table
users {
  id: uuid (PK)
  email: string (unique)
  name: string
  created_at: timestamp
  updated_at: timestamp
}

-- Chat sessions table
chat_sessions {
  id: uuid (PK)
  user_id: uuid (FK -> users.id)
  title: string
  created_at: timestamp
  updated_at: timestamp
  last_message_at: timestamp
  is_active: boolean
}

-- Messages table
messages {
  id: uuid (PK)
  chat_session_id: uuid (FK -> chat_sessions.id)
  content: text
  role: enum ('user', 'assistant')
  created_at: timestamp
  metadata: jsonb
}
```

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy!

### Database for Production

Consider using:
- **Neon** (Serverless PostgreSQL)
- **Supabase** (PostgreSQL with additional features)
- **PlanetScale** (MySQL-compatible)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
