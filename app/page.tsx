// app/page.tsx
'use client';

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        window.location.href = "/dashboard";
      }
    };
    checkSession();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard"
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center px-4">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md text-center transition-all duration-300 hover:scale-[1.02]">

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Smart Bookmark
        </h1>

        <p className="text-gray-500 mb-8">
          Save and manage your bookmarks securely
        </p>

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
        >
          Continue with Google
        </button>

      </div>

    </div>
  );
}
