# Career Counselor Chat App

A modern AI-powered career counseling chat application built with Next.js, TypeScript, and tRPC.

## 🚀 Features

- 🤖 **AI Career Counseling**: Get personalized career advice from an AI counselor
- 💬 **Chat Sessions**: Create, manage, and continue multiple chat sessions
- � **Message Persistence**: All conversations are saved and searchable
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- ⚡ **Real-time Chat**: Live typing indicators and instant responses
- 🔐 **Authentication**: Secure user accounts with session management

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: tRPC, PostgreSQL, Drizzle ORM
- **AI**: OpenAI API / Together.ai
- **Auth**: NextAuth.js
- **State**: TanStack Query

## 📦 Installation

### Clone the repository

```bash
git clone https://github.com/itsAakanksha/career-counselor-ai.git
cd career-counselor-ai
```

### Install dependencies

```bash
npm install
```

### Environment setup

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/career_chat"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
EURON_API_KEY="your-euron-key"
```

### Database setup

```bash
npm run db:push
npm run db:seed
```

### Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 📱 Screenshots

![alt text](image.png)
![alt text](image-1.png)



## 🚦 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push database schema
npm run db:studio    # Open database studio
npm run lint         # Run ESLint
npm run type-check   # TypeScript validation
```



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
