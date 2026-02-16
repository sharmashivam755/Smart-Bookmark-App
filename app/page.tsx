'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Bookmark = {
  id: string;
  title: string;
  url: string;
};

export default function DashboardPage() { // name is optional, must be default export
  const [email, setEmail] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const fetchBookmarks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.log("Fetch Error:", error.message);
    } else {
      setBookmarks(data || []);
    }
  };

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) setEmail(user.email);
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

    const { error } = await supabase.from("bookmarks").insert([
      { title, url, user_id: user.id }
    ]);

    if (error) {
      console.log("Insert Error:", error.message);
    } else {
      setTitle("");
      setUrl("");
      fetchBookmarks();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (error) console.log("Delete Error:", error.message);
    else fetchBookmarks();
  };

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "auto" }}>
      <h1>Dashboard</h1>
      <p>Logged in as: <strong>{email ?? "Loading..."}</strong></p>

      <hr style={{ margin: "20px 0" }} />

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        type="text"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <button
        onClick={handleAdd}
        style={{ padding: "8px 16px", background: "#0070f3", color: "#fff", border: "none", borderRadius: 5 }}
      >
        Add Bookmark
      </button>

      <hr style={{ margin: "30px 0" }} />

      <h2>Your Bookmarks</h2>

      {bookmarks.length === 0 && <p>No bookmarks yet.</p>}

      {bookmarks.map((b) => (
        <div key={b.id} style={{ border: "1px solid #ddd", padding: 15, marginBottom: 15, borderRadius: 8 }}>
          <h3>{b.title}</h3>
          <a href={b.url} target="_blank" rel="noopener noreferrer" style={{ color: "#0070f3" }}>
            {b.url}
          </a>
          <br />
          <button
            onClick={() => handleDelete(b.id)}
            style={{ marginTop: 10, padding: "6px 12px", background: "red", color: "#fff", border: "none", borderRadius: 5 }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
