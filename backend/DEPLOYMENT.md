# Deployment Guide

This guide covers deploying the FoodShare backend API to various platforms.

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud)
- Git repository

## Environment Variables

Before deploying, ensure all environment variables are properly set:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secure_jwt_secret
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-url.com
```

## Local Deployment

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Seed Database (Optional)
```bash
npm run seed
```

### 4. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP or allow access from anywhere (0.0.0.0/0)
5. Get connection string and add to `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/foodshare?retryWrites=true&w=majority
```

## Deployment to Render

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

### 2. Deploy on Render

1. Go to [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: foodshare-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = Your MongoDB Atlas URI
   - `JWT_SECRET` = Your secret key
   - `FRONTEND_URL` = Your frontend URL

6. Click "Create Web Service"

## Deployment to Railway

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - Set root directory to `backend`
   - Add environment variables
5. Click "Deploy"

## Deployment to Heroku

### 1. Install Heroku CLI
```bash
npm install -g heroku
```

### 2. Login and Create App
```bash
heroku login
heroku create foodshare-api
```

### 3. Add MongoDB Add-on (or use MongoDB Atlas)
```bash
heroku addons:create mongolab:sandbox
```

### 4. Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret_key
heroku config:set FRONTEND_URL=https://your-frontend.com
```

### 5. Deploy
```bash
git push heroku main
```

### 6. Seed Database (Optional)
```bash
heroku run npm run seed
```

## Deployment to DigitalOcean App Platform

1. Go to [DigitalOcean](https://www.digitalocean.com)
2. Create a new App
3. Connect your GitHub repository
4. Configure:
   - **Source Directory**: `backend`
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`
5. Add environment variables
6. Click "Create App"

## Deployment to AWS EC2

### 1. Launch EC2 Instance
- Choose Ubuntu Server
- Select t2.micro (free tier)
- Configure security group (allow ports 22, 80, 443, 5000)

### 2. Connect to Instance
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

### 3. Install Node.js and MongoDB
```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB (or use MongoDB Atlas)
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 4. Clone and Setup Project
```bash
git clone your-repo-url
cd your-repo/backend
npm install
```

### 5. Configure Environment
```bash
nano .env
# Add your environment variables
```

### 6. Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
pm2 start src/server.js --name foodshare-api
pm2 startup
pm2 save
```

### 7. Setup Nginx (Optional)
```bash
sudo apt install -y nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/foodshare
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/foodshare /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Docker Deployment

### 1. Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### 2. Create docker-compose.yml
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/foodshare
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo

  mongo:
    image: mongo:6
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

volumes:
  mongodb_data:
```

### 3. Build and Run
```bash
docker-compose up -d
```

## SSL/HTTPS Setup

### Using Let's Encrypt (for EC2/VPS)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Monitoring and Logging

### PM2 Monitoring
```bash
pm2 logs foodshare-api
pm2 monit
```

### Setup Log Rotation
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## Post-Deployment Checklist

- [ ] MongoDB connection working
- [ ] All environment variables set correctly
- [ ] JWT authentication working
- [ ] CORS configured for frontend domain
- [ ] SSL/HTTPS enabled
- [ ] Database seeded (if needed)
- [ ] Error logging enabled
- [ ] Rate limiting active
- [ ] API endpoints tested
- [ ] Frontend can connect to API

## Troubleshooting

### Connection Issues
```bash
# Check if server is running
curl http://localhost:5000/health

# Check logs
pm2 logs foodshare-api

# Check ports
netstat -tuln | grep 5000
```

### MongoDB Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Performance Issues
- Enable compression middleware
- Use MongoDB indexes
- Implement caching (Redis)
- Enable CDN for static files

## Backup Strategy

### Database Backup
```bash
# Manual backup
mongodump --uri="mongodb://localhost:27017/foodshare" --out=/backup/$(date +%Y%m%d)

# Automated backup (cron job)
0 2 * * * mongodump --uri="mongodb://localhost:27017/foodshare" --out=/backup/$(date +\%Y\%m\%d)
```

### Restore Database
```bash
mongorestore --uri="mongodb://localhost:27017/foodshare" /backup/20240101
```
