'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Bookmark = {
  id: string;
  title: string;
  url: string;
};

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const fetchBookmarks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id);

    setBookmarks(data || []);
  };

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/";
      return;
    }
    if (user.email) setEmail(user.email);
  };

  useEffect(() => {
    const init = async () => {
      await checkUser();
      await fetchBookmarks();
    };
    init();
  }, []);

  const handleAdd = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Not logged in");
    if (!title || !url) return alert("Please fill all fields");

    await supabase.from("bookmarks").insert([
      { title, url, user_id: user.id }
    ]);

    setTitle("");
    setUrl("");
    fetchBookmarks();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    fetchBookmarks();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10 bg-white/20 backdrop-blur-lg p-6 rounded-3xl shadow-xl">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-wide">
              Smart Bookmark
            </h1>
            <p className="text-white/80 text-sm mt-1">
              Logged in as {email ?? "Loading..."}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl shadow-md transition duration-300 hover:scale-105"
          >
            Logout
          </button>
        </div>

        {/* Add Bookmark Card */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl mb-10 transition hover:shadow-indigo-300">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Add New Bookmark
          </h2>

          <input
            type="text"
            placeholder="Bookmark Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-4 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <button
            onClick={handleAdd}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition duration-300"
          >
            Add Bookmark 🚀
          </button>
        </div>

        {/* Bookmark List */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white">
            Your Bookmarks
          </h2>

          {bookmarks.length === 0 && (
            <p className="text-white/80">No bookmarks yet.</p>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {bookmarks.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2"
              >
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {b.title}
                </h3>

                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline text-sm break-all"
                >
                  {b.url}
                </a>

                <button
                  onClick={() => handleDelete(b.id)}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition hover:scale-105"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
