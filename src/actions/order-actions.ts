'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { Prisma } from 'generated/prisma/client'

// Simple payment simulator: waits ms and fails ~10% of the time
async function simulatePayment(amount: number, ms = 1500) {
  await new Promise((resolve) => setTimeout(resolve, ms))
  if (Math.random() < 0.1) {
    throw new Error('Payment processing failed')
  }
  return true
}

export type CheckoutInput = {
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

/**
 * Creates an order and returns its ID
 */
export async function createOrder(data: CheckoutInput) {
  // ✅ Only use cookies, no headers

  // Get session from auth using cookies
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // If you want to allow guest checkout, you can comment this
  /*if (!session?.user?.id) {
    throw new Error('Not authenticated')
  }*/

  // 💳 payment simulation (may throw on failure)
  await simulatePayment(data.total)

  const userConnect = session?.user?.id
    ? { connect: { id: session.user.id } }
    : undefined

  const order = await prisma.order.create({
    data: {
      // connect user when available, omit otherwise
      ...(userConnect ? { user: userConnect } : {}),
      status: 'PAID',
      items: {
        create: data.items.map((item) => {
          // handle numeric or string IDs for movies

          return {
            movie: { connect: { id: item.id } },
            priceAtPurchase: item.price,
            quantity: item.quantity,
          }
        }),
      },
      shippingAddress: {
        create: {
          street: data.address.street,
          city: data.address.city,
          country: data.address.country,
          postalCode: data.address.zip, // map zip -> postalCode
        },
      },
    },
  })

  return order.id
}
