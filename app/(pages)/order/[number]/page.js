import React from 'react'
import Order from '@/app/components/Order/Order'

const page = async ({ params }) => {
  const { number: number } = params
  return <Order number={number} />
}

export default page
