# Shivoham Lab Website

Production-ready Next.js 14 App Router website with Supabase, Tailwind CSS, and Framer Motion.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Rename `.env.local.example` to `.env.local` and add your keys:
   ```env
   ADMIN_KEY=your-admin-password
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
   > **Note:** Do NOT expose `ADMIN_KEY` or `SUPABASE_SERVICE_ROLE_KEY` to the client. Never prefix them with `NEXT_PUBLIC_`.

3. **Supabase Database Setup**
   Copy the contents of `supabase/seed.sql` and execute it in your Supabase project's SQL Editor. This will create all required tables, enable RLS, add read-only policies for public access, and insert the default data.

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Admin Panel

The site features a built-in admin panel to manage content without touching code or the database directly.
1. Click the glowing lock icon in the bottom right corner of the website.
2. Enter the password configured in `ADMIN_KEY`.
3. Use the tabs to update the general configuration, projects, research papers, team members, and stage colors.
4. Changes are instantly reflected using optimistic updates and background API calls.

## Deployment on Vercel

1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. In the Vercel dashboard, add all 4 environment variables listed above.
4. Deploy.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + custom variables
- **Animations**: Framer Motion
- **Database**: Supabase
- **Icons**: Lucide React
- **Authentication**: Custom JWT via `jose` and HTTP-only cookies
- **Types**: TypeScript
