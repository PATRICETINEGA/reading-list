'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function AddBook() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [status, setStatus] = useState('to-read')
  const [loading, setLoading] = useState(false)
  const r = useRouter()
  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/books', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, author, status }) })
    setTitle(''); setAuthor(''); setLoading(false); r.refresh()
  }
  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow mb-4 space-y-2">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Book title" className="w-full border p-2 rounded text-sm" required />
      <input value={author} onChange={e=>setAuthor(e.target.value)} placeholder="Author" className="w-full border p-2 rounded text-sm" />
      <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full border p-2 rounded text-sm">
        <option value="to-read">To Read</option>
        <option value="reading">Reading</option>
        <option value="done">Done</option>
      </select>
      <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-1 rounded text-sm disabled:opacity-50">Add</button>
    </form>
  )
}
