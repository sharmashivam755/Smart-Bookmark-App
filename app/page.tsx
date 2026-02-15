'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {

  const [email, setEmail] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [bookmarks, setBookmarks] = useState<any[]>([])

  // ✅ Fetch only logged-in user's bookmarks
  const fetchBookmarks = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      console.log(error.message)
    } else {
      setBookmarks(data || [])
    }
  }

  // ✅ Check logged user
  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      setEmail(user.email!)
    }
  }

  // ✅ Run on page load
  useEffect(() => {
    checkUser()
    fetchBookmarks()
  }, [])

  // ✅ Add bookmark
  const handleAdd = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert("Not logged in")
      return
    }

    if (!title || !url) {
      alert("Please fill all fields")
      return
    }

    const { error } = await supabase.from('bookmarks').insert([
      {
        title: title,
        url: url,
        user_id: user.id
      }
    ])

    if (error) {
      console.log("Error:", error.message)
    } else {
      setTitle('')
      setUrl('')
      fetchBookmarks()
    }
  }

  // ✅ Delete bookmark
  const handleDelete = async (id: any) => {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)

    if (error) {
      console.log(error.message)
    } else {
      fetchBookmarks()
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: 'auto' }}>
      <h1>Dashboard Page</h1>
      <p>Logged in as: <strong>{email}</strong></p>

      <hr />

      <h2>Add Bookmark</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px'
        }}
      />

      <input
        type="text"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px'
        }}
      />

      <button
        onClick={handleAdd}
        style={{
          padding: '8px 16px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}
      >
        Add Bookmark
      </button>

      <hr style={{ margin: '30px 0' }} />

      <h2>Your Bookmarks</h2>

      {bookmarks.length === 0 && <p>No bookmarks yet.</p>}

      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          style={{
            border: '1px solid #ddd',
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '8px'
          }}
        >
          <h3>{bookmark.title}</h3>

          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0070f3' }}
          >
            {bookmark.url}
          </a>

          <br />

          <button
            onClick={() => handleDelete(bookmark.id)}
            style={{
              marginTop: '10px',
              padding: '6px 12px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            Delete
          </button>
        </div>
      ))}

    </div>
  )
}
