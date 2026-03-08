# Deployment Checklist

## ✅ Pre-Deployment

### 1. Dependencies
```bash
npm install
# Verify axios is installed
npm list axios
```

### 2. Environment Variables

#### Development (`.env.local`)
```env
NEXT_PUBLIC_API_URL=https://y3vmpncgmc.ap-south-1.awsapprunner.com/api/v1
```

#### Production (Vercel/Amplify)
Set in deployment platform:
```
NEXT_PUBLIC_API_URL=https://y3vmpncgmc.ap-south-1.awsapprunner.com/api/v1
```

### 3. Test Locally
```bash
npm run dev
```

Test these flows:
- [ ] Register new account
- [ ] Login with credentials
- [ ] Create baby profile
- [ ] Create journal entry
- [ ] View sentiment analysis
- [ ] Check mental health assessment
- [ ] View mood trends
- [ ] Logout and login again

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

#### Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

#### Configure
1. Add environment variable in Vercel dashboard:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://y3vmpncgmc.ap-south-1.awsapprunner.com/api/v1`

2. Deploy:
```bash
vercel --prod
```

**Cost:** Free for personal projects

### Option 2: AWS Amplify

#### Setup
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Add hosting
amplify add hosting

# Configure environment variables in Amplify Console

# Deploy
amplify publish
```

**Cost:** Free tier (1000 build minutes/month)

### Option 3: Netlify

#### Setup
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

Add environment variable in Netlify dashboard.

**Cost:** Free for personal projects

## 🔒 Security Checklist

### Before Production
- [ ] Update CORS on backend to specific origin (not *)
- [ ] Use HTTPS for all API calls
- [ ] Implement rate limiting on backend
- [ ] Add input validation on all forms
- [ ] Sanitize user inputs
- [ ] Implement proper error handling
- [ ] Add logging for security events
- [ ] Review JWT token expiration
- [ ] Implement refresh token mechanism (if needed)

### Backend CORS Update
Update your backend `Program.cs`:
```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("https://your-app.vercel.app")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

## 📊 Monitoring

### Setup Monitoring
1. **Vercel Analytics** (if using Vercel)
   - Already included via `@vercel/analytics`

2. **Error Tracking**
   - Consider adding Sentry:
   ```bash
   npm install @sentry/nextjs
   ```

3. **API Monitoring**
   - Monitor API response times
   - Track error rates
   - Set up alerts for 5xx errors

## 🧪 Testing Checklist

### Functional Tests
- [ ] User registration works
- [ ] User login works
- [ ] Token persists across page refreshes
- [ ] Protected routes redirect to login
- [ ] Baby profile creation works
- [ ] Journal entry creation works
- [ ] Sentiment analysis displays correctly
- [ ] Red flags show emergency resources
- [ ] Mental health assessment loads
- [ ] Mood trends display correctly
- [ ] Logout clears session

### UI/UX Tests
- [ ] Mobile responsive design
- [ ] Loading states show correctly
- [ ] Error messages are user-friendly
- [ ] Toast notifications work
- [ ] Forms validate properly
- [ ] Navigation works smoothly

### Performance Tests
- [ ] Page load time < 3 seconds
- [ ] API calls complete quickly
- [ ] Images optimized
- [ ] No console errors
- [ ] No memory leaks

## 📱 Mobile Testing

Test on:
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Different screen sizes
- [ ] Portrait and landscape modes

## 🔄 Post-Deployment

### Verify Production
1. Visit your deployed URL
2. Test complete user flow
3. Check browser console for errors
4. Verify API calls in Network tab
5. Test on mobile devices

### Monitor
- [ ] Check error logs daily
- [ ] Monitor API response times
- [ ] Track user registrations
- [ ] Review sentiment analysis accuracy
- [ ] Monitor red flag detections

## 📝 Documentation

### Update Documentation
- [ ] Add production URL to README
- [ ] Document deployment process
- [ ] Create user guide
- [ ] Document API endpoints used
- [ ] Add troubleshooting guide

## 🎯 Launch Checklist

### Final Steps
- [ ] All tests passing
- [ ] Environment variables set
- [ ] CORS configured on backend
- [ ] SSL certificate active
- [ ] Monitoring setup
- [ ] Error tracking enabled
- [ ] Documentation complete
- [ ] Team trained on deployment process

### Go Live
1. Deploy to production
2. Test production environment
3. Monitor for first 24 hours
4. Collect user feedback
5. Iterate based on feedback

## 🆘 Troubleshooting

### Common Issues

#### API Calls Failing
```bash
# Check environment variable
echo $NEXT_PUBLIC_API_URL

# Test API directly
curl https://y3vmpncgmc.ap-south-1.awsapprunner.com/api/v1/Auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

#### CORS Errors
- Update backend CORS settings
- Verify API URL is correct
- Check browser console for details

#### Build Errors
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

#### Token Issues
- Check localStorage in browser DevTools
- Verify token format
- Check token expiration

## 📞 Support

- Backend API: https://y3vmpncgmc.ap-south-1.awsapprunner.com/swagger
- Frontend Docs: See `API_INTEGRATION_GUIDE.md`
- Quick Start: See `QUICK_START.md`

## ✨ Success Criteria

Your deployment is successful when:
- ✅ Users can register and login
- ✅ Journal entries save with sentiment analysis
- ✅ Mental health assessments work
- ✅ Mood trends display correctly
- ✅ Emergency resources show for red flags
- ✅ Mobile experience is smooth
- ✅ No console errors
- ✅ API calls complete successfully

Ready to deploy! 🚀
