# FitPulse 💪

Your personal fitness companion. Discover 15-minute workouts, track your progress, and achieve your health goals.

## Features

- 🏋️ **15-Minute Workouts** - Quick, effective workouts with video tutorials
- 📊 **Progress Tracking** - Track your workouts, streaks, and weekly goals
- 🎯 **Weekly Goals** - Set and achieve your fitness targets (75 minutes/week)
- 📱 **Multi-language** - English & Dutch support
- 🎥 **Video Tutorials** - YouTube video guides for each exercise
- 📈 **Workout History** - View your completed workouts and achievements

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js Serverless Functions
- **Database**: Neon PostgreSQL
- **Styling**: Tailwind CSS
- **Deployment**: Netlify

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=your_neon_database_url
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   
   This will start:
   - Frontend on `http://localhost:5173`
   - API server on `http://localhost:3001`

## Database Setup

This app uses Neon PostgreSQL. Make sure you have:
1. A Neon database instance
2. The `DATABASE_URL` environment variable set
3. Run the schema from `db/schema.sql` to create the tables

## Deployment to Netlify

1. **Push to GitHub** (already done)
2. **Import to Netlify**:
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Select the repository

3. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

4. **Add environment variables**:
   - Go to Site settings → Environment variables
   - Add `DATABASE_URL` with your Neon database connection string

5. **Deploy!**

## Project Structure

```
├── api/                 # Serverless API functions
│   ├── auth/           # Authentication endpoints
│   ├── user/           # User profile endpoints
│   └── _lib/           # Shared utilities (database)
├── src/
│   ├── components/     # React components
│   ├── context/        # React contexts (Auth, Workouts, Language)
│   ├── data/           # Static data (workout programs)
│   ├── pages/          # Page components
│   └── services/       # API service functions
├── db/                 # Database schema and seed files
├── server.js           # Local development server
└── netlify.toml        # Netlify configuration
```

## Environment Variables

- `DATABASE_URL` - Your Neon PostgreSQL connection string

## License

MIT
