# Subscription Tracker - Full Stack Solution

A complete, secure, and modern solution for managing your subscriptions—featuring a powerful **Laravel API backend** and a sleek, responsive **Next.js frontend**.  
Track, update, and get reminders for all your subscriptions with robust authentication, instant notifications, and full CRUD capabilities.

---

## 🌐 Live Demo

**Access** [Subscription Tracker](https://subs-tracker.mdshahriar.me/) Online.

---
## ✨ Features

- Modern, responsive Next.js frontend for a seamless user experience.
- Secure Laravel API backend with JWT authentication.
- Full CRUD (Create, Read, Update, Delete) operations for managing subscriptions.
- Email notifications and reminders for expired or instructed subscriptions.
- Redis-powered queues for efficient email and reminder delivery.
- Scheduled jobs and workers for cleaning up expired tokens and data.
- Dockerized for easy local development and production deployment.
- Nginx reverse proxy for unified access and security.
- Environment variable support for flexible configuration.

---

## 🚀 Project Structure

This repository contains **both the frontend and backend** for Subscription Tracker:

- **Frontend:**  
  [`Frontend/SubscriptionTracker`](./FrontEnd/subscription-tracker)  
  Built with **Next.js (React + TypeScript)**

- **Backend:**  
  [`Backend/SubscriptionTracker`](./Backend/SubscriptionTracker)  
  Built with **Laravel 11 (PHP. API-only)**

Each service has its own detailed documentation.  
**For feature list, technical stack, and standalone (non-Docker) instructions, please see:**
- [Frontend README](./FrontEnd/subscription-tracker/README.md)
- [Backend README](./Backend/SubscriptionTracker/README.md)

---

## 🧭 How To Run (Full Stack)

You can run the entire stack in one of two ways:

### 1. **Run Without Docker (Development Mode)**

If you want to run everything on your local machine **without Docker**, please follow the detailed instructions in each service's README:

- [Frontend: Local Development Guide](./FrontEnd/subscription-tracker/README.md)
- [Backend: Local Development Guide](./Backend/SubscriptionTracker/README.md)

**You will need:**
- Node.js (22.x+) for frontend
- PHP (8.4+), Composer, MySQL, Redis for backend
- Manually configure environment variables and run both services in dev mode

---

### 2. **Run With Docker (Recommended for Development & Production)**

The easiest and most reliable way to run the full stack is with Docker Compose.  
You have two options:

#### **A. Local Build (for development or custom changes)**

1. **Clone this repo and open the root directory:**

   ```sh
   git clone https://github.com/Shahriar-Mahmud-Toha/SubscriptionTracker.git
   cd SubscriptionTracker
   ```

2. **Copy environment:**

   ```sh
   cp .env.example .env
   ```

   - Edit `.env` and adjust secrets/values as needed (see table below).

3. **Build and run all services:**

   ```sh
   docker compose up --build -d
   ```

   This will build the backend and frontend from source and start all services (backend, frontend, nginx, MySQL, Redis).

#### **B. Production-Ready (using prebuilt images from Docker Hub)**

1. **Download the latest config files:**
   - [`docker-compose.production.yml`](./docker-compose.production.yml)
   - [`nginx/nginx.conf`](./nginx/nginx.conf)
   - [`.env.example`](./.env.example) → rename to `.env` and edit

#### 📦 Quick File Download Instructions

> **These commands help you quickly download the required Docker Compose, environment, and Nginx config files for setup.**  
> The commands differ slightly depending on your operating system and terminal.

---

#### **Linux & macOS (Terminal/Bash/Zsh)**
Use the following commands in your terminal (**Bash**, **Zsh**, or similar shells):

```sh
curl -O https://raw.githubusercontent.com/Shahriar-Mahmud-Toha/SubscriptionTracker/master/docker-compose.production.yml
mkdir -p nginx && curl -o nginx/nginx.conf https://raw.githubusercontent.com/Shahriar-Mahmud-Toha/SubscriptionTracker/master/nginx/nginx.conf
curl -O https://raw.githubusercontent.com/Shahriar-Mahmud-Toha/SubscriptionTracker/master/.env.example && mv .env.example .env
# Edit .env as needed, then:
docker compose -f docker-compose.production.yml up -d
```

---

#### **Windows (Command Prompt / cmd.exe)**

For **cmd.exe**, you can use `curl` if it's available (Windows 10+):

```cmd
curl -O https://raw.githubusercontent.com/Shahriar-Mahmud-Toha/SubscriptionTracker/master/docker-compose.production.yml
mkdir nginx
curl -o nginx\nginx.conf https://raw.githubusercontent.com/Shahriar-Mahmud-Toha/SubscriptionTracker/master/nginx/nginx.conf
curl -O https://raw.githubusercontent.com/Shahriar-Mahmud-Toha/SubscriptionTracker/master/.env.example
rename .env.example .env

# REM Edit .env as needed, then:

docker compose -f docker-compose.production.yml up -d
```

2. **Start the stack with prebuilt images:**

   ```sh
   docker compose -f docker-compose.production.yml up -d
   ```

   This will pull production images from Docker Hub:

   - [Frontend image](https://hub.docker.com/r/shahriar001/subscription-tracker-frontend)
   - [Backend image](https://hub.docker.com/r/shahriar001/subscription-tracker-backend)

---

### ⚙️ Environment Variables Reference

| Variable                | Description                                                                 | Example Value                        |
|-------------------------|-----------------------------------------------------------------------------|--------------------------------------|
| **DB_HOST**             | Hostname for MySQL database (Docker service name)                           | `subs-tracker-database`              |
| **DB_PORT**             | MySQL port                                                                  | `3306`                               |
| **DB_USERNAME**         | MySQL username                                                              | `root`                               |
| **MYSQL_DATABASE**      | MySQL database name                                                         | `subscription_tracker`               |
| **MYSQL_ROOT_PASSWORD** | MySQL root password                                                         | `your_db_root_password_here`         |
| **REDIS_HOST**          | Redis hostname (Docker service name)                                        | `subs-tracker-redis`                 |
| **REDIS_PORT**          | Redis port                                                                  | `6379`                               |
| **REDIS_PASSWORD**      | Redis access password                                                       | `redis_password_here`                |
| **APP_KEY**             | Laravel app key (backend secret)                                            | `base64:...`                         |
| **APP_ENV**             | Laravel environment                                                         | `production`                         |
| **APP_DEBUG**           | Laravel debug mode (should be `false` in production)                        | `false`                              |
| **FRONT_END_URL**       | The public URL where the frontend is accessible                             | `https://yourdomain.com` or `http://192.168.10.2` (local IP for testing) |
| **FRONTEND_SECRET**     | Shared secret for frontend-backend communication                            | `zgGbB28m5Mn77U...` (min 128 chars, avoid $,&,@,%)          |
| **MAIL_HOST**           | SMTP server host                                                            | `smtp.mailtrap.io`                   |
| **MAIL_PORT**           | SMTP server port                                                            | `2525`                               |
| **MAIL_USERNAME**       | SMTP username                                                               | `2ddfd45fda851`                      |
| **MAIL_PASSWORD**       | SMTP password                                                               | `o5sddsfddf54d9`                     |
| **MAIL_ENCRYPTION**     | Mail encryption type                                                        | `tls`                                |
| **MAIL_FROM_ADDRESS**   | Default sender email address                                                | `noreply@yourdomain.com`             |
| **JWT_SECRET**          | Secret for backend JWT authentication                                       | `btM0rQ9vhL...`                      |
| **NODE_ENV**            | Node.js environment for frontend                                            | `production`                         |
| **COOKIE_SECURE**       | Should cookies be sent only over HTTPS? (`true`/`false`)                    | `false` (local), `true` (production) |
| **BACKEND_URL**         | Internal URL for the backend API (through Nginx; change only if needed)     | `http://subs-tracker-nginx:8000/api` |
| **SERVER_SECRET**       | Frontend server secret (should match `FRONTEND_SECRET`)                     | `${FRONTEND_SECRET}`                 |
| **NEXT_PUBLIC_APP_URL** | The public URL where the frontend is accessible (same as `FRONT_END_URL`)   | `${FRONT_END_URL}`                   |
| **IP_LOOKUP**           | Public IP lookup endpoint (for IP-based features; no need to change)        | `https://api.ipify.org?format=json`  |

---

### 📝 Nginx Configuration (Required)

Place the following file at `nginx/nginx.conf` (next to your compose file):

```nginx
server {
    listen 3000;
    server_name frontend.local;

    location / {
        proxy_pass http://subs-tracker-frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 8000;
    server_name backend.local;

    root /var/www/public;
    index index.php index.html index.htm;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass subs-tracker-backend:9000;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

**Summary:**  
- Nginx proxies frontend traffic to the Next.js container (`subs-tracker-frontend:3000`)
- Nginx serves the backend Laravel API via FPM (`subs-tracker-backend:9000`) on port 8000
- Host port 3000 is mapped to Nginx for easy access at `http://localhost:3000`

---

### 🐳 Docker Compose File

See the [latest `docker-compose.production.yml` file](./docker-compose.production.yml) or view below:

```yaml
services:
  subs-tracker-backend:
    image: shahriar001/subscription-tracker-backend
    container_name: subs-tracker-backend
    restart: unless-stopped
    volumes:
      - backend_data:/var/www/storage
    depends_on:
      - subs-tracker-database
      - subs-tracker-redis
    networks:
      - app-network
    environment:
      APP_KEY: "${APP_KEY}"
      APP_ENV: "${APP_ENV}"
      APP_DEBUG: "${APP_DEBUG}"
      FRONT_END_URL: "${FRONT_END_URL}"
      FRONTEND_SECRET: "${FRONTEND_SECRET}"
      DB_HOST: "${DB_HOST}"
      DB_PORT: "${DB_PORT}"
      DB_DATABASE: "${MYSQL_DATABASE}"
      DB_USERNAME: "${DB_USERNAME}"
      DB_PASSWORD: "${MYSQL_ROOT_PASSWORD}"
      REDIS_HOST: "${REDIS_HOST}"
      REDIS_PORT: "${REDIS_PORT}"
      REDIS_PASSWORD: "${REDIS_PASSWORD}"
      MAIL_HOST: "${MAIL_HOST}"
      MAIL_PORT: "${MAIL_PORT}"
      MAIL_USERNAME: "${MAIL_USERNAME}"
      MAIL_PASSWORD: "${MAIL_PASSWORD}"
      MAIL_ENCRYPTION: "${MAIL_ENCRYPTION}"
      MAIL_FROM_ADDRESS: "${MAIL_FROM_ADDRESS}"
      JWT_SECRET: "${JWT_SECRET}"

  subs-tracker-nginx:
    image: nginx:stable
    container_name: subs-tracker-nginx
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/custom.conf
    depends_on:
      - subs-tracker-backend
      - subs-tracker-frontend
    networks:
      - app-network

  subs-tracker-frontend:
    image: shahriar001/subscription-tracker-frontend
    container_name: subs-tracker-frontend
    restart: unless-stopped
    depends_on:
      - subs-tracker-backend
    networks:
      - app-network
    environment:
      NODE_ENV: "${NODE_ENV}"
      COOKIE_SECURE: "${COOKIE_SECURE}"
      BACKEND_URL: "${BACKEND_URL}"
      SERVER_SECRET: "${SERVER_SECRET}"
      NEXT_PUBLIC_APP_URL: "${NEXT_PUBLIC_APP_URL}"
      IP_LOOKUP: "${IP_LOOKUP}"

  subs-tracker-database:
    image: mysql:8.0.42
    container_name: subs-tracker-database
    restart: unless-stopped
    volumes:
      - db_data:/var/lib/mysql
    environment:
      MYSQL_DATABASE: "${MYSQL_DATABASE}"
      MYSQL_ROOT_PASSWORD: "${MYSQL_ROOT_PASSWORD}"
    ports:
      - "127.0.0.1:3306:3306" # Bind to localhost for security
    networks:
      - app-network

  subs-tracker-redis:
    image: redis:8.0.2
    container_name: subs-tracker-redis
    restart: unless-stopped
    volumes:
      - redis_data:/data
    command: ["redis-server", "--requirepass", "${REDIS_PASSWORD}", "--appendonly", "yes"]
    networks:
      - app-network

volumes:
  backend_data:
  db_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

---

### 🎯 Accessing the App

- **Local**: Visit [http://localhost/](http://localhost/) (served by Nginx, proxying to Next.js frontend)

---

## 📚 Further Documentation

- **Frontend documentation:**  
  [/FrontEnd/subscription-tracker/README.md](./FrontEnd/subscription-tracker/README.md)
- **Backend documentation:**  
  [Backend/SubscriptionTracker/README.md](./Backend/SubscriptionTracker/README.md)
- **API Docs:**  
  [Backend/SubscriptionTracker/API_DOCS.md](./Backend/SubscriptionTracker/API_DOCS.md)
- **Docker Compose and Environment Examples:**  
  [docker-compose.production.yml](./docker-compose.production.yml)  
  [nginx/nginx.conf](./nginx/nginx.conf)  
  [.env.example](./.env.example)

---

## 🛡️ Security & Best Practices

- **Change all secrets & passwords** in your `.env` file for production use.
- **Do not expose the backend** directly to the internet—always use Nginx as a reverse proxy.
- **Use HTTPS** and set `COOKIE_SECURE=true` for real production deployments.
- **Set up proper mail credentials** for production reminders/notifications.

---

## 📝 License

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/).

You are free to view, share, and adapt the code for **non-commercial purposes** with proper attribution.  
**Commercial use, redistribution, or republishing is not allowed** without explicit permission from the author.

For permission requests, please contact via [mdshahriar.me](https://mdshahriar.me)  
or reach out on GitHub: [Shahriar-Mahmud-Toha](https://github.com/Shahriar-Mahmud-Toha).

---