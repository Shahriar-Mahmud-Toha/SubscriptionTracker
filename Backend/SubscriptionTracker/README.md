# Subscription Tracker API ![version](https://img.shields.io/badge/version-1.6-blue)

A robust backend API for managing and tracking user subscriptions, built with Laravel. This project enables users to securely register, verify their email, manage their profile, and perform full CRUD (Create, Read, Update, Delete) operations on their subscriptions. Users receive automated email notifications when subscriptions are about to expire or at a custom reminder time.

---

## 🌟 Overview

- **Secure Login & Registration:**  
  You must sign up and verify your email before using the app. All login sessions are protected with secure tokens, so your data stays safe.

- **Automatic Reminders:**  
  The system will send you emails when your subscriptions are about to expire, or at a custom time you set.

- **Easy Management:**  
  You can add, update, or delete your subscriptions anytime.

- **Protected Access:**  
  Only the official frontend website can connect to this backend, so your information is never exposed to unauthorized apps.

- **Safety Features:**  
  All special links (like password reset or email verification) will expire after a short time, so no one else can use them.

- **Performance:**  
  The system uses advanced technology to keep things fast and clean, automatically removing old or expired data.

---

## 🛠️ Technical Features for Developers

### **Authentication & Token System**
- **JWT-Based Authentication:**  
  - Uses both **access tokens** (short-lived) and **refresh tokens** (longer-lived) for secure, stateless authentication.
  - Refresh tokens allow users to get new access tokens without logging in again, improving user experience and security.
  - All tokens (access, refresh, password reset, signup, email verification) are **time-constrained** and expire after a set period.

### **API Access & Security**
- **API-Only Backend:**  
  - This backend is not for direct use by end-users; it serves a frontend server (like a web or mobile app).
  - **CORS is strictly configured**: Only requests from the official frontend server’s IP/domain are allowed.
- **Custom Middleware:**  
  - Both authentication and authorization are handled by custom-built middleware for fine-grained control.
  - **Custom robust rate limiting** is implemented to prevent abuse and brute-force attacks.

### **Background Processing & Performance**
- **Queues & Workers:**  
  - Uses **Redis** as the queue driver for efficient, fast background job processing (like sending emails and reminders).
  - Multiple workers and scheduled cron jobs are used to handle tasks and keep the database and Redis clean (e.g., removing expired tokens and unnecessary data).
  - Redis is also used for fast token refreshing and efficient queue handling.

### **Other Technical Details**
- **Database:** MySQL (8.0.40)
- **Redis:** 5.0.14.1
- **Mail:** SMTP (configurable)
- **Framework:** Laravel 11.9
- **PHP:** 8.4.1
- **API Documentation:** [API_DOCS.md](./API_DOCS.md)

#### Design & Data Integrity Principles

- **SOLID Principles:**  
  The codebase is structured following SOLID object-oriented design principles, ensuring maintainability, scalability, and testability. Each class and module has a single responsibility, dependencies are injected, and interfaces are used for abstraction and flexibility.

- **ACID Transactions:**  
  All critical database operations (such as subscription creation, updates, and deletions) are wrapped in ACID-compliant transactions. This guarantees data integrity, consistency, and reliability, even in the event of errors or concurrent operations.
---
## 📁 Project Folder Structure

Below is an overview of the main folder structure for this Laravel API project. This will help developers quickly understand the organization and where to find key components:

```
SubscriptionTracker/
├── app/
│   ├── Console/
│   │   └── Commands/                # Custom Artisan commands (e.g., cleanup tasks)
│   ├── Exceptions/                  # Exception handling
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/                 # API controllers (Auth, User, Subscription, etc.)
│   │   ├── Middleware/              # Custom middleware (Authentication, Authorization, etc.)
│   ├── Mail/                        # Mailable classes for notifications
│   ├── Models/                      # Eloquent models (Subscription, Authentication, etc.)
│   ├── Services/                    # Business logic and service classes
│   ├── Repositories/                # Database operations classes
│   ├── Jobs/                        # Queue jobs (e.g., SendSubscriptionReminderJob)
│   ├── Providers/                   # Service providers (AppServiceProvider, etc.)
│
├── bootstrap/                       # Laravel bootstrap files
├── config/                          # Configuration files (queue, mail, database, etc.)
├── database/
│   ├── migrations/                  # Database migration files
│   ├── seeders/                     # Database seeders
│
├── public/                          # Publicly accessible files (index.php, assets)
├── resources/
│   └── views/
│       └── emails/                  # Blade templates for emails
│
├── routes/
│   └── api.php                      # API route definitions
│
├── storage/                         # Logs, compiled views, file uploads, etc.
├── tests/                           # Automated tests
├── .env.example                     # Example environment configuration
├── composer.json                    # Composer dependencies
├── README.md                        # Project documentation
├── API_DOCS.md                      # Detailed API documentation
```

**Key Points:**
- **Controllers** are grouped under `app/Http/Controllers/Api` for API separation.
- **Middleware** is in `app/Http/Middleware` for custom authentication, authorization, and rate limiting.
- **Services** encapsulate business logic, keeping controllers thin.
- **Repositories** Database operations handled independently.
- **Jobs** and **Mail** handle background tasks and notifications.
- **Migrations** and **Seeders** are in `database/` for easy database setup.
- **API routes** are defined in `routes/api.php`.
- **Email templates** are in `resources/views/emails`.

This structure follows Laravel best practices and is designed for scalability, maintainability, and clarity for all developers.

---

## ⚠️ Prerequisites

Before you get started, make sure your system has the following installed:

- **PHP (8.2 or higher recommended):**  
  [Download PHP](https://www.php.net/downloads.php)
- **Composer (Dependency Manager):**  
  [Download Composer](https://getcomposer.org/download/)
- **MySQL (8.x recommended):**  
  [Download MySQL](https://dev.mysql.com/downloads/)
- **Redis (5.x or higher recommended):**  
  [Download Redis](https://redis.io/download/)
- **SMTP Email Account:**  
  You need a sandbox email account (like [Mailtrap](https://mailtrap.io/)) or a real email account with SMTP access for mail configuration.

---

## 🚀 Getting Started

### 1. **Clone the Repository**

```bash
git clone https://github.com/Shahriar-Mahmud-Toha/SubscriptionTracker.git
cd SubscriptionTracker/Backend/SubscriptionTracker
```

### 2. **Install Dependencies**

```bash
composer install
```

### 3. **Environment Setup**

- Copy `.env.example` to `.env`:

  ```bash
  cp .env.example .env
  ```

- **Mandatory `.env` changes:**

  - **Database:**
    ```
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=your_database
    DB_USERNAME=your_username
    DB_PASSWORD=your_password
    ```
  - **Redis:**
    ```
    REDIS_CLIENT=phpredis
    REDIS_HOST=127.0.0.1
    REDIS_PASSWORD=your_redis_password
    REDIS_PORT=6379
    REDIS_DB=0
    REDIS_CACHE_DB=1
    REDIS_PREFIX=Subscription_Tracker:
    ```
  - **Mail:**
    ```
    MAIL_MAILER=smtp
    MAIL_HOST=smtp.mailtrap.io
    MAIL_PORT=2525
    MAIL_USERNAME=your_mail_username
    MAIL_PASSWORD=your_mail_password
    MAIL_ENCRYPTION=tls
    MAIL_FROM_ADDRESS=your@email.com
    MAIL_FROM_NAME="Subscription Tracker"
    ```
  - **Queue:**
    ```
    QUEUE_CONNECTION=redis
    ```
- **Generate Application Keys:**

  After setting up your `.env` file, run the following commands to generate the necessary application keys:

  ```bash
  php artisan key:generate
  php artisan jwt:secret
  ```

  These commands will set the `APP_KEY` and `JWT_SECRET` in your `.env` file, which are required for encryption and JWT authentication.

### 4. **Database Migration & Seeding**

```bash
php artisan migrate
php artisan db:seed
```

### 5. **Run the Application**

```bash
php artisan serve
```

---

## ⚡ Running Queues & Scheduled Jobs

**Queue Worker (for email verifications):**
```bash
php artisan queue:work --queue=high,mid,default,low
```
**Queue Worker (for reminders and notifications):**
```bash
php artisan queue:work --queue=reminder
```

**Scheduler (for periodic tasks):**
```bash
php artisan schedule:work
```
> _All these commands must be running for email verifications, notifications and scheduled tasks to work properly._

---

## 🔒 License & Usage

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/).

You are free to view, share, and adapt the code for **non-commercial purposes** with proper attribution.  
Commercial use, redistribution, or republishing is **not allowed** without explicit permission from the author **Md. Shahriar Mahmud** (GitHub: *Shahriar-Mahmud-Toha*).

---

**Enjoy tracking your subscriptions and never miss a renewal again!**