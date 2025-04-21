This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Recall - AI-Powered Note Taking App

Store your memories, ideas, and knowledge. Then chat with them using AI.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Authentication Setup

This application uses Firebase for authentication. Follow these steps to set up authentication:

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)

2. Enable Authentication in your Firebase project:
   - Go to the Firebase console
   - Select your project
   - Click on "Authentication" in the left sidebar
   - Go to the "Sign-in method" tab
   - Enable "Email/Password" and "Google" providers

3. Create a web app in your Firebase project:
   - Go to Project Settings
   - Scroll down to "Your apps" section and click the web icon (</>) to add a web app
   - Register your app with a nickname (e.g., "Recall Web App")
   - Copy the Firebase configuration object

4. Create a `.env.local` file in the root of your project and add your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

5. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```

## Authentication Features

The application implements the following authentication features:

- **Sign Up**: Users can create an account with email and password
- **Login**: Users can sign in with their email and password
- **Google Authentication**: Users can sign up or login with their Google account
- **Email Verification**: Email verification is required for accounts created with email/password
- **Password Reset**: Users can reset their password through a recovery email
- **Protected Routes**: The `/app` routes are protected and require authentication
- **Authentication State**: The app maintains authentication state across the application

### Email Verification Process

1. When a user signs up using email/password, a verification email is sent automatically
2. The user needs to click the verification link in their email to verify their address
3. If the email is not received, users can request a new verification email from the login page
4. Users with unverified emails will see a verification banner in the app

### Password Reset Process

1. Users can access the forgot password page from the login page
2. After entering their email address, a password reset link is sent to their email
3. Clicking the link in the email will open a page where they can set a new password
4. After resetting their password, users can log in with the new credentials
