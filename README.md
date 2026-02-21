# 🚀 Smart Bookmark App

A modern full-stack bookmark manager built with Next.js and Supabase.

Users can securely log in using Google OAuth and manage their personal bookmarks in real time.

---

## 📌 Problem Statement

Most users save important links across browsers, notes, or messaging apps, which leads to poor organization and difficulty accessing them later.

The goal of this project was to build a secure, real-time bookmark manager where:

- Each user has private bookmarks
- Authentication is handled securely
- Data updates instantly without refreshing
- The UI feels modern and responsive

---

## 🛠 Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Database + Authentication)
- Google OAuth
- Vercel (Deployment)

---

## 🔐 Features

- Google Login (OAuth only)
- Private bookmarks per user
- Add & delete bookmarks
- Real-time updates
- Responsive modern UI
- Gradient dashboard design

---

## ⚡ Challenges Faced

### 1️⃣ Handling Private User Data

Problem:
Ensuring User A cannot see User B's bookmarks.

Solution:
Used Supabase row-level filtering by matching `user_id` with the authenticated user's ID.

---

### 2️⃣ OAuth Redirect Issues on Deployment

Problem:
Deployment failed due to missing environment variables and incorrect redirect URLs.

Solution:
Configured environment variables in Vercel:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

Updated Google OAuth redirect URLs inside Supabase settings.

---

### 3️⃣ Real-Time Data Sync

Problem:
Bookmarks needed to update instantly after adding or deleting.

Solution:
Re-fetch bookmarks after insert/delete operations and structured state properly.

---

## 🚀 How to Run Locally

1. Clone the repository

