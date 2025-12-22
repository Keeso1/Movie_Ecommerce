'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { cookies, headers as nextHeaders } from 'next/headers'

type CheckoutInput = {
  items: {
    id: string
    price: number
    quantity: number
  }[]
  address: {
    fullName: string
    street: string
    city: string
    country: string
    zip: string
  }
  total: number
}

export async function createOrder(data: CheckoutInput) {
  //  Create EMPTY Headers object (better-auth only checks existence)
  const h = new Headers()

  //  Pass cookies correctly
  const session = await auth.api.getSession({
    headers: h,
    cookies: cookies(),
  })

  if (!session?.user?.id) {
    throw new Error('Not authenticated')
  }

  // 💳 payment simulation
  await new Promise((res) => setTimeout(res, 1500))

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      total: data.total,
      status: 'PAID',
      items: {
        create: data.items.map((item) => ({
          movieId: item.id,
          price: item.price,
          quantity: item.quantity,
        })),
      },
      address: {
        create: data.address,
      },
    },
  })

  return order.id
}

