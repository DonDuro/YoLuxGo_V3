# YoLuxGo™ Platform v3.0 - Deployment Guide

## Overview

This deployment package contains the complete YoLuxGo™ platform (Version 3.0) with all dependencies removed from Replit and configured for production deployment on various cloud platforms.

## Features Included

- ✅ Complete luxury transportation and security platform
- ✅ 4 user types: Client, Service Provider, Regional Partner, Admin
- ✅ Personnel management with comprehensive profiles
- ✅ Multi-service booking system
- ✅ Investment interest and collaborator application management
- ✅ Comprehensive mock data for demonstration
- ✅ Legal compliance (Privacy Policy, Terms of Service)
- ✅ Contact system with role-based access
- ✅ Vetting procedures and user guides
- ✅ JWT-based authentication with unified admin access
- ✅ PostgreSQL database integration
- ✅ Stripe payment processing
- ✅ SendGrid email integration

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Environment variables configured
- Domain name (for production)

## Required Environment Variables

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
SESSION_SECRET=your-secure-session-secret-min-32-chars

# Stripe (Payment Processing)
STRIPE_SECRET_KEY=sk_live_or_test_key
VITE_STRIPE_PUBLIC_KEY=pk_live_or_test_key

# SendGrid (Email Services)
SENDGRID_API_KEY=SG.your-sendgrid-api-key

# Optional
NODE_ENV=production
PORT=5000
```

## Deployment Options

### 1. GitHub Deployment

1. **Create Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial YoLuxGo v3.0 deployment"
   git branch -M main
   git remote add origin https://github.com/yourusername/yoluxgo-platform.git
   git push -u origin main
   ```

2. **Set Up GitHub Actions** (Optional)
   - Create `.github/workflows/deploy.yml` for CI/CD
   - Configure secrets in repository settings

### 2. Render.com Deployment

1. **Using render.yaml**
   - Connect your GitHub repository to Render
   - The `render.yaml` file will automatically configure services
   - Set environment variables in Render dashboard

2. **Manual Setup**
   - Create new Web Service on Render
   - Connect GitHub repository
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Add environment variables

### 3. AWS Deployment

#### Using CloudFormation

1. **Deploy Stack**
   ```bash
   aws cloudformation create-stack \
     --stack-name yoluxgo-platform \
     --template-body file://aws-cloudformation.yml \
     --parameters ParameterKey=DatabaseUrl,ParameterValue="your-db-url" \
                  ParameterKey=SessionSecret,ParameterValue="your-session-secret" \
                  ParameterKey=StripeSecretKey,ParameterValue="your-stripe-key" \
                  ParameterKey=StripePublicKey,ParameterValue="your-stripe-public-key" \
                  ParameterKey=SendGridApiKey,ParameterValue="your-sendgrid-key" \
     --capabilities CAPABILITY_IAM
   ```

#### Using ECS (Manual)

1. **Build and Push Docker Image**
   ```bash
   docker build -t yoluxgo-platform .
   docker tag yoluxgo-platform:latest your-account.dkr.ecr.region.amazonaws.com/yoluxgo-platform:latest
   docker push your-account.dkr.ecr.region.amazonaws.com/yoluxgo-platform:latest
   ```

2. **Create ECS Service**
   - Use the CloudFormation template as reference
   - Configure task definition with environment variables
   - Set up load balancer and auto-scaling

### 4. Docker Deployment

#### Docker Compose (Recommended)

1. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

2. **Deploy**
   ```bash
   docker-compose up -d
   ```

#### Standalone Docker

1. **Build Image**
   ```bash
   docker build -t yoluxgo-platform .
   ```

2. **Run Container**
   ```bash
   docker run -d \
     -p 5000:5000 \
     -e DATABASE_URL="your-database-url" \
     -e SESSION_SECRET="your-session-secret" \
     -e STRIPE_SECRET_KEY="your-stripe-secret" \
     -e VITE_STRIPE_PUBLIC_KEY="your-stripe-public" \
     -e SENDGRID_API_KEY="your-sendgrid-key" \
     --name yoluxgo-platform \
     yoluxgo-platform
   ```

### 5. Heroku Deployment

1. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

2. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:basic
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set SESSION_SECRET="your-session-secret"
   heroku config:set STRIPE_SECRET_KEY="your-stripe-secret"
   heroku config:set VITE_STRIPE_PUBLIC_KEY="your-stripe-public"
   heroku config:set SENDGRID_API_KEY="your-sendgrid-key"
   heroku config:set NODE_ENV="production"
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### 6. Railway Deployment

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy**
   ```bash
   railway login
   railway init
   railway add --database postgresql
   railway deploy
   ```

3. **Set Environment Variables**
   - Configure in Railway dashboard

### 7. DigitalOcean App Platform

1. **Create App**
   - Connect GitHub repository
   - Configure build and run commands:
     - Build: `npm install && npm run build`
     - Run: `npm start`

2. **Add Database**
   - Create managed PostgreSQL database
   - Configure DATABASE_URL automatically

3. **Set Environment Variables**
   - Add all required variables in App settings

## Database Setup

### 1. Initialize Database

```bash
npm run db:push
```

### 2. Verify Tables

The following tables should be created:
- `users` - User accounts and profiles
- `sessions` - Session storage
- `investment_interests` - Investment interest submissions
- `job_applications` - Job/collaborator applications
- `vetting_requests` - User vetting submissions
- `contact_inquiries` - Contact form submissions

## Post-Deployment Checklist

1. **Test Authentication**
   - Login with test accounts
   - Verify JWT token generation

2. **Test Core Features**
   - User registration and login
   - Dashboard access for all user types
   - Service booking functionality
   - Investment interest submission
   - Contact form submission

3. **Verify Integrations**
   - Database connectivity
   - Stripe payment processing
   - SendGrid email delivery

4. **Security Checks**
   - HTTPS enforcement
   - Environment variable security
   - Database connection security

## Test Accounts

### Admin Accounts
- **Master Admin**: calvarado@nebusis.com / admin123
- **CTO Admin**: dzambrano@nebusis.com / admin123

### Client Accounts
- **VIP Client**: client.vip@mockylg.com / admin123
- **Premium Client**: client.premium@mockylg.com / admin123

### Service Provider Accounts
- **Individual Provider**: provider.individual@mockylg.com / admin123
- **Company Provider**: provider.company@mockylg.com / admin123

### Regional Partner Account
- **Regional Partner**: partner.regional@mockylg.com / admin123

### Personnel Account
- **Personnel**: personnel@mockylg.com / admin123

### Development Admin
- **Dev Admin**: dev@yoluxgo.test / devadmin123

### HR Account
- **HR Manager**: hr@yoluxgo.com / hr123

## Monitoring and Maintenance

### Health Checks
- Application health: `GET /`
- Database connectivity: Monitor connection logs
- API endpoints: Test core functionality regularly

### Logs
- Application logs: Check for authentication and API errors
- Database logs: Monitor query performance
- Load balancer logs: Track traffic patterns

### Scaling
- Monitor CPU and memory usage
- Scale ECS services or container instances as needed
- Consider CDN for static assets in high-traffic scenarios

## Support

For deployment issues or questions:
- Review error logs first
- Check environment variable configuration
- Verify database connectivity
- Contact: yoluxgo@nebusis.com

## Version History

- **v1.0**: Initial platform with basic features
- **v2.0**: Legal compliance and contact system
- **v3.0**: Investment management and comprehensive mock data

---

**© 2025 Nebusis Cloud Services, LLC. All rights reserved.**
**YoLuxGo™ is a trademark of Nebusis Cloud Services, LLC.**