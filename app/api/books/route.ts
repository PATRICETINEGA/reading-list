import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { title, author, status } = body
  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 })

  const book = await prisma.book.create({
    data: { title, author, status: status || 'to-read', ownerId: (session.user as any).id },
  })
  return NextResponse.json(book)
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const book = await prisma.book.findUnique({ where: { id } })
  if (!book || book.ownerId !== (session.user as any).id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.book.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
