'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { createOrder } from '@/actions/order-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart, getTotalPrice } = useCart()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const orderId = await createOrder({
      items: cart,
      total: getTotalPrice(),
      address: {
        fullName: formData.get('fullName') as string,
        street: formData.get('street') as string,
        city: formData.get('city') as string,
        country: formData.get('country') as string,
        zip: formData.get('zip') as string,
      },
    })

    clearCart()
    router.push(`/order-success/${orderId}`)
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl mx-auto space-y-6 p-8">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <Input name="fullName" placeholder="Full Name" required />
      <Input name="street" placeholder="Street Address" required />
      <Input name="city" placeholder="City" required />
      <Input name="country" placeholder="Country" required />
      <Input name="zip" placeholder="ZIP Code" required />

      <p className="font-semibold">
        Total: ${getTotalPrice().toFixed(2)}
      </p>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  )
}
