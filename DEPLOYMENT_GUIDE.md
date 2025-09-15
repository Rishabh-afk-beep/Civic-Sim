# CivicSim Vercel Deployment Guide

## 🚀 Deploying to Vercel

### Prerequisites
1. GitHub account
2. Vercel account (free tier available)
3. API keys for external services (Gemini, Data.gov.in)

### Step 1: Prepare Your Repository
1. Ensure all files are committed to your GitHub repository
2. Make sure the `.gitignore` file excludes sensitive information
3. Push your latest changes to the main branch

### Step 2: Set Up Vercel Project
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your `Civic-Sim` repository from GitHub
4. Vercel will automatically detect the configuration from `vercel.json`

### Step 3: Configure Environment Variables
In your Vercel project dashboard, go to Settings → Environment Variables and add:

#### Required Variables:
```
SECRET_KEY=your-super-secret-key-change-this-in-production
GEMINI_API_KEY=your-gemini-api-key
DATAGOVINDIA_API_KEY=your-datagovindia-api-key
DATABASE_URL=sqlite:///./civicsim.db
REACT_APP_API_BASE_URL=https://your-project-name.vercel.app
CORS_ORIGINS=["https://your-project-name.vercel.app"]
```

#### Optional Variables:
```
DEBUG=False
AI_PROVIDER=gemini
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
MAX_FILE_SIZE=10485760
GEMINI_MODEL=gemini-1.5-flash
AI_TIMEOUT=30
LOG_LEVEL=INFO
```

### Step 4: Update API Base URL
Once deployed, update the `REACT_APP_API_BASE_URL` environment variable with your actual Vercel domain.

### Step 5: Deploy
1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be available at `https://your-project-name.vercel.app`

## 🔧 Configuration Details

### Frontend Configuration
- Build command: `cd frontend/my-app && npm run build`
- Output directory: `frontend/my-app/build`
- Framework: React (automatically detected)

### Backend Configuration
- Runtime: Python 3.9
- Entry point: `api/index.py`
- Routes: All `/api/*` requests are routed to the Python backend

### Database Considerations
For production, consider using:
- **PostgreSQL**: Vercel Postgres (recommended)
- **PlanetScale**: MySQL-compatible serverless database
- **Supabase**: PostgreSQL with additional features

## 🚨 Important Security Notes

1. **Never commit sensitive data** (API keys, secrets) to your repository
2. **Use environment variables** for all configuration
3. **Rotate your secrets** regularly
4. **Enable CORS** only for your domain in production
5. **Use HTTPS** for all external API calls

## 🛠️ Troubleshooting

### Common Issues:

#### Build Failures
- Check that all dependencies are listed in `requirements.txt`
- Ensure Python version compatibility (3.9)
- Verify that the build command is correct

#### API Errors
- Check environment variables are set correctly
- Verify API keys are valid and have proper permissions
- Check CORS configuration

#### Database Issues
- SQLite has limitations in serverless environments
- Consider migrating to a hosted database for production
- Ensure database migrations are run properly

### Logs and Debugging
- Check Vercel Function logs in the dashboard
- Use Vercel CLI for local testing: `vercel dev`
- Monitor performance and errors in the Vercel dashboard

## 📊 Performance Optimization

1. **Static Assets**: Served by Vercel's CDN automatically
2. **Function Cold Starts**: Keep functions warm with periodic pings
3. **Database**: Use connection pooling for hosted databases
4. **Caching**: Implement appropriate caching strategies

## 🔄 Continuous Deployment

Once connected to GitHub:
- Automatic deployments on push to main branch
- Preview deployments for pull requests
- Rollback capabilities through Vercel dashboard

## 📞 Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [React Deployment Best Practices](https://create-react-app.dev/docs/deployment/)

---

**Your CivicSim application is now ready for public deployment! 🎉**