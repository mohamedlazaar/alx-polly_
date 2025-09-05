# ALX Polly - Modern Polling Application

A comprehensive, full-featured polling application built with Next.js 15, TypeScript, Tailwind CSS, and Supabase. Create, share, and participate in polls with real-time results, beautiful UI, and robust authentication.

## 🚀 Features

### 🎯 Core Functionality
- **User Authentication**: Secure login and registration system with Supabase Auth
- **Poll Creation**: Intuitive interface for creating custom polls with multiple options
- **Poll Voting**: Easy-to-use voting system supporting both single and multiple votes
- **Results Display**: Beautiful charts and statistics for poll results with real-time updates
- **Poll Management**: Comprehensive dashboard for managing your created polls
- **Anonymous Voting**: Support for anonymous voting with email/name collection
- **Poll Expiration**: Set expiration dates for time-limited polls

### 🎨 User Experience
- **Modern Design**: Clean, responsive design using Shadcn/ui components
- **Mobile Responsive**: Optimized for all device sizes with mobile-first approach
- **Real-time Updates**: Live results as votes come in with smooth animations
- **Accessibility**: Built with accessibility best practices and ARIA labels
- **Loading States**: Comprehensive loading and error state handling
- **Success Feedback**: Clear success messages and smooth transitions

### 🔧 Technical Features
- **TypeScript**: Full type safety throughout the application with comprehensive interfaces
- **Next.js 15**: Latest features with App Router and Server Components
- **Tailwind CSS**: Utility-first styling with custom design system
- **Shadcn/ui**: High-quality, accessible component library
- **Supabase**: Authentication and database backend with Row Level Security
- **Middleware**: Route protection and authentication handling
- **Server Actions**: Optimized data mutations using Next.js Server Actions
- **Database Optimization**: Efficient queries with proper indexing and relationships

## 🛠️ Setup & Installation

### Prerequisites
- **Node.js 18+** - Required for Next.js 15
- **npm or yarn** - Package manager
- **Supabase account** - For authentication and database
- **Git** - For version control

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd alx-polly
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database:**
   - Go to your Supabase project's SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Run the SQL script to create all necessary tables and functions

5. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Detailed Setup Instructions

#### Supabase Configuration

1. **Create a Supabase Project:**
   - Visit [supabase.com](https://supabase.com) and sign up
   - Click "New Project" and choose your organization
   - Enter project details and select a region close to your users

2. **Get API Keys:**
   - Go to Settings > API in your Supabase dashboard
   - Copy the Project URL and anon public key
   - Add them to your `.env.local` file

3. **Set up Authentication:**
   - Go to Authentication > Settings in your Supabase dashboard
   - Enable Email authentication
   - Configure email templates (optional but recommended)

4. **Database Setup:**
   - Go to SQL Editor in your Supabase dashboard
   - Copy the entire contents of `supabase-schema.sql`
   - Paste and run the SQL script
   - Verify that all tables and functions were created successfully

#### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For production deployments
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📖 Usage Examples

### Creating a Poll

1. **Sign up or log in** to your account
2. **Navigate to "Create Poll"** from the dashboard
3. **Fill in poll details:**
   - Enter a compelling title
   - Add an optional description
   - Create 2-10 poll options
   - Configure poll settings (multiple votes, public/private)
   - Set an optional expiration date
4. **Click "Create Poll"** to publish

### Voting on Polls

1. **Browse public polls** on the polls page
2. **Click on a poll** to view details and vote
3. **Select your choice(s)** based on poll settings
4. **Submit your vote** (anonymous users need to provide name/email)
5. **View real-time results** with beautiful progress bars

### Managing Your Polls

1. **Access your dashboard** to see all your polls
2. **View poll statistics** including vote counts and engagement
3. **Edit poll settings** (title, description, expiration)
4. **Delete polls** when no longer needed
5. **Share poll links** with others

## 🔐 Authentication Flow

### User Registration & Login
1. **Registration**: Users create accounts with email/password
2. **Email Verification**: Supabase sends confirmation emails automatically
3. **Login**: Secure authentication with session management
4. **Password Reset**: Self-service password recovery via email
5. **Session Management**: Automatic session handling with secure cookies

### Route Protection
- **Public Routes**: Landing page, poll viewing, anonymous voting
- **Protected Routes**: Dashboard, poll creation, poll management
- **Middleware**: Automatic redirection for unauthenticated users
- **Role-based Access**: Users can only manage their own polls

## 🏗️ Project Structure

```
alx-polly/
├── app/                          # Next.js App Router directory
│   ├── (auth)/                   # Authentication route group
│   │   ├── login/                # Login page
│   │   │   └── page.tsx         # Login form with Supabase auth
│   │   ├── register/             # Registration page
│   │   │   └── page.tsx         # Registration form
│   │   └── forgot-password/      # Password reset page
│   │       └── page.tsx         # Password reset form
│   ├── (dashboard)/              # Dashboard route group
│   │   ├── layout.tsx           # Dashboard layout with navigation
│   │   ├── dashboard/           # Main dashboard
│   │   │   └── page.tsx         # Dashboard overview
│   │   └── polls/               # Poll management pages
│   │       ├── page.tsx         # Polls listing
│   │       ├── create/          # Poll creation
│   │       │   └── page.tsx     # Create poll form
│   │       └── [id]/            # Individual poll pages
│   │           └── page.tsx     # Poll voting and results
│   ├── components/              # Reusable components
│   │   ├── ui/                  # Shadcn/ui base components
│   │   │   ├── button.tsx       # Button component
│   │   │   ├── card.tsx         # Card components
│   │   │   └── input.tsx        # Input component
│   │   ├── forms/               # Form components
│   │   │   └── CreatePollForm.tsx # Poll creation form
│   │   ├── PollVotingForm.tsx   # Poll voting interface
│   │   └── PollActions.tsx      # Poll management actions
│   ├── contexts/                # React contexts
│   │   └── AuthContext.tsx      # Authentication state management
│   ├── lib/                     # Utility libraries
│   │   ├── actions.ts           # Server Actions for data mutations
│   │   ├── database.ts          # Database service layer
│   │   ├── voteHandler.ts       # Vote submission logic
│   │   ├── supabase.ts          # Supabase client configuration
│   │   └── utils.ts             # Common utility functions
│   ├── types/                   # TypeScript type definitions
│   │   ├── index.ts             # App-wide types
│   │   └── database.ts          # Database schema types
│   ├── globals.css              # Global styles and Tailwind
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Landing page
├── public/                      # Static assets
├── supabase-schema.sql          # Database schema
├── middleware.ts                # Route protection middleware
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## 🧩 Key Components

### Authentication System
- **AuthContext**: Centralized authentication state management with React Context
- **Login/Register Pages**: Secure forms with Supabase authentication integration
- **Middleware**: Route protection and automatic redirection for unauthenticated users
- **Session Management**: Automatic session handling with secure cookies
- **Password Reset**: Self-service password recovery with email verification

### Poll Management
- **CreatePollForm**: Comprehensive form with dynamic option management
- **PollVotingForm**: Interactive voting interface with real-time results
- **PollActions**: Poll management operations (edit, delete, share)
- **DatabaseService**: Centralized database operations with error handling
- **VoteHandler**: Optimized vote submission with parallel processing

### User Interface
- **Shadcn/ui Components**: High-quality, accessible UI components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Loading States**: Comprehensive loading and error state handling
- **Success Feedback**: Clear success messages and smooth transitions
- **Accessibility**: ARIA labels and keyboard navigation support

### Data Management
- **Server Actions**: Optimized data mutations using Next.js Server Actions
- **Type Safety**: Comprehensive TypeScript interfaces and type checking
- **Database Optimization**: Efficient queries with proper indexing
- **Real-time Updates**: Live results with smooth animations
- **Error Handling**: Robust error handling throughout the application

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For production deployments
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Get your credentials** from Settings > API
3. **Enable Email Auth** in Authentication > Providers
4. **Configure email templates** in Authentication > Email Templates (optional)
5. **Set up Row Level Security** (automatically configured via schema)

### Database Schema

The application uses a PostgreSQL database with the following main tables:

- **polls**: Stores poll information and settings
- **poll_options**: Stores poll options/choices
- **votes**: Stores individual votes (supports both authenticated and anonymous)
- **poll_stats**: View for aggregated poll statistics

Key features:
- **Row Level Security (RLS)**: Ensures users can only access their own data
- **Automatic timestamps**: Created/updated timestamps for all records
- **Cascading deletes**: Poll deletion automatically removes related data
- **Vote constraints**: Prevents duplicate voting based on poll settings

## 📚 TypeScript & Development

### Type Safety

The application is built with comprehensive TypeScript support:

```typescript
// Core poll interface
interface Poll {
  id: string
  title: string
  description?: string
  created_by: string
  created_at: string
  expires_at?: string
  is_active: boolean
  allow_multiple_votes: boolean
  is_public: boolean
  status: 'active' | 'inactive' | 'expired'
}

// Poll creation data
interface CreatePollData {
  title: string
  description?: string
  options: string[]
  expires_at?: string
  allow_multiple_votes: boolean
  is_public: boolean
}

// Vote submission data
interface VoteData {
  poll_id: string
  option_id: string
  user_id?: string
  voter_email?: string
  voter_name?: string
}
```

### Custom Hooks

#### useAuth Hook
Provides authentication state and methods:

```typescript
const { 
  user,           // Current user object or null
  session,        // Current session object
  loading,        // Loading state
  signIn,         // Sign in method
  signUp,         // Sign up method
  signOut,        // Sign out method
  resetPassword,  // Password reset method
  updateProfile   // Profile update method
} = useAuth()
```

### Styling System

The app uses a comprehensive design system:

- **Tailwind CSS**: Utility-first styling with custom configuration
- **Shadcn/ui**: High-quality, accessible component library
- **Design Tokens**: Consistent colors, spacing, and typography
- **Responsive Design**: Mobile-first approach with breakpoint system
- **Dark Mode Ready**: Prepared for future dark mode implementation
- **Accessibility**: WCAG 2.1 AA compliant components

## 🚀 Future Enhancements

### Planned Features
- [ ] **Real-time Updates**: WebSocket integration for live voting results
- [ ] **Advanced Analytics**: Detailed poll statistics and engagement metrics
- [ ] **Poll Categories**: Organize polls by topics and tags
- [ ] **User Profiles**: Enhanced user profiles with avatars and statistics
- [ ] **Email Notifications**: Poll updates and voting reminders
- [ ] **Poll Embedding**: Embed polls in external websites
- [ ] **API Endpoints**: RESTful API for external integrations
- [ ] **Advanced Search**: Full-text search and filtering capabilities
- [ ] **Poll Templates**: Pre-built poll templates for common use cases
- [ ] **Export Features**: Export results to CSV, PDF, and other formats
- [ ] **QR Code Generation**: Generate QR codes for easy poll sharing
- [ ] **Poll Scheduling**: Schedule polls to go live at specific times

### Technical Improvements
- [ ] **Performance Optimization**: Caching strategies and query optimization
- [ ] **Image Upload**: Support for images in poll options
- [ ] **Rate Limiting**: API rate limiting and security measures
- [ ] **Testing Suite**: Comprehensive unit and integration tests
- [ ] **PWA Support**: Progressive Web App capabilities
- [ ] **Internationalization**: Multi-language support
- [ ] **Accessibility**: Enhanced accessibility features
- [ ] **Monitoring**: Application performance monitoring and logging

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository** and clone your fork
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests if applicable
4. **Follow the coding standards** (TypeScript, ESLint, Prettier)
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to your branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request** with a clear description of your changes

### Development Guidelines

- Follow the existing code style and patterns
- Add comprehensive documentation for new features
- Include tests for new functionality
- Update the README if needed
- Ensure all TypeScript types are properly defined

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Email**: Contact the maintainers for urgent issues

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Supabase Team** for the excellent backend platform
- **Shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework
- **Vercel** for the deployment platform
