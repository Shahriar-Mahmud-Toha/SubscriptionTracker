# Subscription Tracker - Frontend ![version](https://img.shields.io/badge/version-1.0.8-blue)

A modern, secure, and user-friendly frontend for the [Subscription Tracker API](https://github.com/Shahriar-Mahmud-Toha/SubscriptionTracker/tree/master/Backend/SubscriptionTracker), enabling users to manage their subscriptions, profile, and account with ease. This project is built with **Next.js** (App Router), React, and TypeScript, and is designed to work seamlessly with the robust **Laravel** backend.

---

## 🌟 Overview

**Subscription Tracker Frontend** provides a smooth, responsive, and secure experience for users to:

- **Register, verify email, and log in securely**
- **Manage their profile and account settings**
- **Add, update, and delete subscriptions**
- **Receive real-time feedback with beautiful toast notifications**
- **Enjoy a mobile-friendly, responsive UI**
- **Benefit from instant UI updates with optimistic updates**

---

## ✨ Key Features

### 🔒 Secure Authentication & Profile Management

- **Sign Up & Email Verification:** Users must register and verify their email before accessing the app.
- **Secure Login:** All authentication and verification logic is handled server-side for maximum security.
- **Sensitive Cookies:** Auth tokens are stored in HTTP-only cookies, protecting against XSS and CSRF attacks.
- **Profile Management:** Users can update their personal info and change their password, with all changes validated and processed securely on the server.

### 📅 Subscription Management

- **Full CRUD:** Users can create, view, update, and delete subscriptions.
- **Automatic Reminders:** Users receive email notifications before subscriptions expire or at custom reminder times (handled by backend).
- **Optimistic UI:** Instant feedback on subscription changes using React’s `useOptimistic` for a smooth experience.

### 🖥️ User Experience

- **Beautiful, Consistent UI:** Built with Tailwind CSS and custom themes.
- **Toast Notifications:** Success and error messages are shown using [Sonner](https://sonner.emilkowal.ski/) toasts, styled to match the app’s theme.
- **Responsive Design:** Fully mobile-friendly and works great on all screen sizes.
- **User-Friendly Navigation:** Intuitive navigation and clear feedback for all actions.

### 🛡️ Security

- **Server-Side Data Fetching:** All sensitive operations (auth, profile, subscription data) are fetched and validated on the server.
- **No Sensitive Data in Client State:** All authentication and verification is handled server-side; sensitive cookies are never exposed to JavaScript.
- **XSS & CSRF Protection:** The app is designed to prevent cross-site scripting and cross-site request forgery attacks.
- **Strict CORS:** Only the official frontend can communicate with the backend API.

---

## ⚙️ Technical Stack

- **Framework:** [Next.js 15.3.2](https://nextjs.org/)
- **Language:** TypeScript
- **UI:** React, Tailwind CSS
- **State Management:** React Context, React Hooks
- **Toast Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Form Handling:** React Hook Form
- **API Communication:** Fetch API (with server actions)
- **Optimistic Updates:** React’s `useOptimistic`
- **Security:** HTTP-only cookies, server-side auth, XSS/CSRF protection

---

## ⚠️ Prerequisites

Before you get started, make sure your system has the following installed:

- **Node.js (22.x or higher recommended):**  
  [Download Node.js](https://nodejs.org/)

- **Backend API:**  
  You must have the [Subscription Tracker API (Laravel backend)](https://github.com/Shahriar-Mahmud-Toha/SubscriptionTracker/tree/master/Backend/SubscriptionTracker) running.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Shahriar-Mahmud-Toha/SubscriptionTracker.git
cd SubscriptionTracker/FrontEnd/subscription-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env.local` file and set the backend API URL and any other required environment variables:

```
BACKEND_URL=http://127.0.0.1:8000/api
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---
## 📁 Folder Structure

```
.
├── public/                                 # Static assets served at the root URL
│   ├── assets/                             # App fonts, images, logos, icons, etc.
│   ├── favicon.ico                         # Favicon
│   └── ...                                 # Other static files (robots.txt, etc.)
│
├── .env.local                              # Local development secrets (highest priority, gitignored)
├── .env.development                        # Development environment variables (Shared between developers)
├── .env.production                         # Production environment variables (gitignored)
│
├── .env.example                            # Example env file for contributors (never contains secrets)
│
├── next.config.js                          # Next.js configuration
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── README.md
│
└── src/
    ├── app/                                   # Next.js App Router directory
    │   ├── (private)/                         # Protected routes (profile, dashboard, etc.)
    │   │   ├── profile/
    │   │   │   ├── page.tsx
    │   │   │   └── ... 
    │   │   ├── dashboard/
    │   │   │   └── ...
    │   │   └── layout.tsx
    │   ├── (public)/                          # Public routes (login, register, etc.)
    │   │   ├── login/
    │   │   │   ├── page.tsx
    │   │   │   └── ...
    │   │   ├── register/
    │   │   │   └── ...
    │   │   └── layout.tsx
    │   │   └── page.tsx                       # Public Main entry point
    │   ├── layout.tsx                         # Root layout
    │
    ├── actions.ts                             # Global server actions (shared across features)
    │
    ├── components/                            # Common, reusable UI components
    │   ├── buttons/
    │   │   └── submit-button-regular.tsx
    │   ├── forms/
    │   │   └── form-input.tsx
    │   ├── loaders/
    │   │   └── spinner.tsx
    │   ├── toasts/
    │   │   ├── promise-success.tsx
    │   │   └── simple-success.tsx
    │   ├── titles/
    │   │   └── section-title.tsx
    │   └── ... (other shared UI components)
    │
    ├── contexts/                              # Common React context providers (shared project-wide)
    │   └── theme-context.tsx
    │   └── ...
    │
    ├── features/                              # Feature-based modules (domain-driven)
    │   ├── auth/
    │   │   ├── actions.ts
    │   │   ├── components/
    │   │   │   └── login-form.tsx
    │   │   ├── contexts/
    │   │   │   └── auth-context.tsx
    │   │   ├── hooks/
    │   │   │   └── use-auth.ts
    │   │   └── ... (other auth-specific files)
    │   ├── profile/
    │   │   ├── actions.ts
    │   │   ├── components/
    │   │   │   ├── general-info/
    │   │   │   │   ├── general-info-controller.tsx
    │   │   │   │   ├── general-info-form.tsx
    │   │   │   │   ├── show-general-info.tsx
    │   │   │   │   └── ...
    │   │   │   ├── email-info/
    │   │   │   │   └── ...
    │   │   │   └── ...
    │   │   ├── contexts/
    │   │   │   └── general-info-context.tsx
    │   │   ├── hooks/
    │   │   │   └── use-profile.ts
    │   │   └── types.ts
    │   ├── subscriptions/
    │   │   ├── actions.ts
    │   │   ├── components/
    │   │   │   └── subscription-list.tsx
    │   │   ├── contexts/
    │   │   │   └── subscription-context.tsx
    │   │   ├── hooks/
    │   │   │   └── use-subscription.ts
    │   │   └── types.ts
    │   └── ... (other features)
    │
    ├── hooks/                                 # Common React hooks (shared project-wide)
    │   └── use-media-query.ts
    │   └── ...
    │
    ├── lib/                                   # Shared libraries, utilities, or wrappers
    │   └── ...                                # (e.g., api.ts, fetcher.ts)
    │
    ├── middleware.ts                          # Custom Next.js middleware (e.g., auth, logging)
    │
    ├── styles/
    │   └── globals.css                        # Tailwind and global CSS
    │
    ├── types/                                 # Global TypeScript types and interfaces
    │
    └── utils/                                 # Utility functions (date formatting, helpers, etc.)
        ├── helper.ts
        └── timing.ts
        └── validator.ts
```

### 📂 Public Directory

- **Purpose:**  
  The `public/` directory contains static assets that are served directly at the root URL.  
  This includes images, icons, favicons, robots.txt, and any other files that do not require processing by Webpack or Next.js. 
  These files can referenced in code using `/images/filename.png`, etc.

---

### 🌱 Environment Files & Priority

- `.env.development` – Common variables, secrets which can be shared with other developers. (lowest priority than local, committed)
- `.env.local` – Local development secrets. Put only those secrets which should overwrite .development env (highest priority, **gitignored**)
- `.env.production` – Production environment variables. Overwrite secrets which must be used in production. (**gitignored**)
- `.env.example` – Example file for contributors (never contains secrets, committed)

**Priority order:**  
`.env.local` > `.env.[environment]` > `.env`  
> Only `.env.development`, `.env.example` are committed.  
> `.env.local`, `.env.production` are **gitignored** for security.

---

## 📦 Project Structure & Conventions

- **src/components, src/contexts, src/hooks:**  
  These folders contain files and modules that are **shared across the entire project**. Any feature can use them.

- **src/features:**  
  Each feature (e.g., `profile`, `subscriptions`) has its own folder.  
  Inside each feature folder, you may find:
  - `components/` (feature-specific UI)
  - `hooks/` (feature-specific hooks)
  - `contexts/` (feature-specific contexts)
  - `actions.ts` (feature-specific server/client actions)
  - `types.ts` (feature-specific types)

  **Note:**  
  - Except for the `auth` feature, **features cannot share code directly with each other**.  
  - Features can use anything from `src/components`, `src/contexts`, `src/hooks`, or the `auth` module, but not from other features.
  - The `app` directory **must not directly import from outside the `features` folder**; it should only use modules from `features`.


- **Naming Conventions:**
  - **Project Name:** kebab-case (e.g., `subscription-tracker`)
  - **Folders:** kebab-case (e.g., `general-info-controller.tsx`, `subscription-list.tsx`)
  - **Files:** kebab-case for components, PascalCase for React components inside files
  - **Types:** PascalCase (e.g., `GeneralInfoType`)
  - **Hooks:** use prefix (e.g., `useProfile`)
  - **Contexts:** Suffix with `Context` (e.g., `ThemeContext`)
  - **Feature folders:** singular or plural as appropriate (e.g., `profile`, `subscriptions`)

---

## 📝 License

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/).

You are free to view, share, and adapt the code for **non-commercial purposes** with proper attribution.  
**Commercial use, redistribution, or republishing is not allowed** without explicit permission from the author.

For permission requests, please contact via [mdshahriar.me](https://mdshahriar.me)  
or reach out on GitHub: [Shahriar-Mahmud-Toha](https://github.com/Shahriar-Mahmud-Toha).

---

**Enjoy managing your subscriptions with confidence and ease!**