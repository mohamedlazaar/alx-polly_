# Polling App

A modern, full-featured polling application built with Next.js 15, TypeScript, Tailwind CSS, and Supabase authentication. Create, share, and participate in polls with real-time results.

## Features

### 🎯 Core Features
- **User Authentication**: Secure login and registration system with Supabase
- **Poll Creation**: Intuitive interface for creating custom polls
- **Poll Voting**: Easy-to-use voting system with real-time updates
- **Results Display**: Beautiful charts and statistics for poll results
- **Poll Management**: Dashboard for managing your created polls
- **Protected Routes**: Middleware-based route protection

### 🎨 UI/UX Features
- **Modern Design**: Clean, responsive design using Shadcn components
- **Mobile Responsive**: Optimized for all device sizes
- **Real-time Updates**: Live results as votes come in
- **Accessibility**: Built with accessibility best practices

### 🔧 Technical Features
- **TypeScript**: Full type safety throughout the application
- **Next.js 15**: Latest features with App Router
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: High-quality, accessible components
- **Supabase**: Authentication and database backend
- **Middleware**: Route protection and authentication handling

## Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd alx-polly
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Create a `.env.local` file in the root directory with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication Flow

1. **Registration**: Users can create accounts with email/password
2. **Email Verification**: Supabase sends confirmation emails
3. **Login**: Users can sign in with their credentials
4. **Protected Routes**: Certain pages require authentication
5. **Session Management**: Automatic session handling with cookies

## Project Structure

```
app/
├── (auth)/                    # Authentication pages
│   ├── login/
│   │   └── page.tsx          # Login page with Supabase auth
│   └── register/
│       └── page.tsx          # Registration page with Supabase auth
├── (dashboard)/              # Dashboard layout and pages
│   ├── layout.tsx            # Dashboard layout with auth
│   └── dashboard/
│       └── page.tsx          # Main dashboard page
├── polls/                    # Poll-related pages
│   ├── page.tsx              # Polls listing page
│   ├── create/
│   │   └── page.tsx          # Create new poll page (protected)
│   └── [id]/
│       └── page.tsx          # Individual poll page
├── components/               # Reusable components
│   ├── ui/                   # Shadcn UI components
│   │   ├── button.tsx        # Button component
│   │   ├── card.tsx          # Card components
│   │   └── input.tsx         # Input component
│   └── forms/                # Form components
│       └── CreatePollForm.tsx # Poll creation form
├── contexts/                 # React contexts
│   └── AuthContext.tsx       # Authentication context
├── lib/                      # Utility libraries
│   ├── utils.ts              # Common utility functions
│   └── supabase.ts           # Supabase client configuration
├── types/                    # TypeScript type definitions
│   └── index.ts              # App-wide types
├── globals.css               # Global styles
├── layout.tsx                # Root layout with AuthProvider
└── page.tsx                  # Landing page (redirects to login)
```

## Key Components

### Authentication System
- **Login/Register Pages**: Forms with Supabase authentication
- **Auth Context**: React context for user state management
- **Middleware**: Route protection and authentication handling
- **Protected Routes**: Automatic redirection for unauthenticated users

### Poll Management
- **Poll Creation**: Comprehensive form with multiple options, settings, and expiration dates
- **Poll Listing**: Grid view of all available polls with search and filtering
- **Poll Voting**: Interactive voting interface with real-time results
- **Results Display**: Visual representation of poll results with progress bars

### Dashboard
- **Overview**: Statistics and recent activity
- **Quick Actions**: Easy access to common tasks
- **Recent Polls**: List of user's recent polls with status
- **User Info**: Display user name and sign out functionality

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Get your credentials** from Settings > API
3. **Enable Email Auth** in Authentication > Providers
4. **Configure email templates** in Authentication > Email Templates (optional)

## TypeScript Types

The app includes comprehensive TypeScript definitions:

```typescript
interface Poll {
  id: string
  title: string
  description?: string
  options: PollOption[]
  createdBy: string
  createdAt: Date
  expiresAt?: Date
  isActive: boolean
  allowMultipleVotes: boolean
  isPublic: boolean
}

interface CreatePollData {
  title: string
  description?: string
  options: string[]
  expiresAt?: Date
  allowMultipleVotes: boolean
  isPublic: boolean
}
```

## Custom Hooks

### useAuth
Provides authentication state and methods:

```typescript
const { user, loading, signIn, signUp, signOut } = useAuth()
```

## Styling

The app uses Tailwind CSS with custom components from Shadcn/ui:

- **Consistent Design**: All components follow the same design system
- **Responsive**: Mobile-first responsive design
- **Accessible**: Built with accessibility in mind
- **Customizable**: Easy to customize colors and themes

## Future Enhancements

### Planned Features
- [ ] Real-time voting with WebSockets
- [ ] Advanced analytics and charts
- [ ] Poll categories and tags
- [ ] User profiles and avatars
- [ ] Email notifications
- [ ] Poll embedding for external sites
- [ ] API endpoints for external integrations
- [ ] Advanced search and filtering
- [ ] Poll templates
- [ ] Export results to CSV/PDF

### Technical Improvements
- [ ] Database integration for polls and votes
- [ ] Image upload for poll options
- [ ] Rate limiting and security measures
- [ ] Unit and integration tests
- [ ] Performance optimization
- [ ] PWA capabilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
