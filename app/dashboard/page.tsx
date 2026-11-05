import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AddBook from '@/components/AddBook'
export default async function Dash() {
  const s = await getSession()
  if (!s) redirect('/login')
  const uid = (s.user as any).id
  const books = await prisma.book.findMany({ where: { ownerId: uid }, orderBy: { createdAt: 'desc' } })
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Reading List</h1>
        <Link href="/api/auth/signout" className="text-sm text-red-600">Sign out</Link>
      </div>
      <AddBook />
      <div className="space-y-2">
        {books.map((b: any) => (
          <div key={b.id} className="bg-white p-3 rounded shadow flex justify-between text-sm">
            <div><span className="font-medium">{b.title}</span> {b.author && <span className="text-gray-500">· {b.author}</span>}</div>
            <span className="text-xs text-gray-400">{b.status}</span>
          </div>
        ))}
        {books.length === 0 && <p className="text-gray-500">No books yet</p>}
      </div>
    </div>
  )
}
