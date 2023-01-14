import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
} from '../../styles/pages/product'

import { GetStaticProps, GetStaticPaths } from 'next'
import Image from 'next/image'
import { stripe } from '../../lib/stripe'
import Stripe from 'stripe'
import axios from 'axios'
import { useState } from 'react'
import Head from 'next/head'

interface ProductProps {
  product: {
    name: string
    imageUrl: string
    id: string
    price: string
    description: string
    defaultPriceId: string
  }
}

const Product = ({ product }: ProductProps) => {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] =
    useState(false)

  async function handleBuyButton() {
    try {
      setIsCreatingCheckoutSession(true)

      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
      })

      const { checkoutUrl } = response.data

      window.location.href = checkoutUrl
    } catch (err) {
      setIsCreatingCheckoutSession(false)

      alert('Falha ao redirecionar ao checkout!')
    }
  }

  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>
      <ProductContainer>
        <ImageContainer>
          <Image src={product.imageUrl} width={520} height={480} alt="" />
        </ImageContainer>

        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>

          <p>{product.description}</p>

          <button
            disabled={isCreatingCheckoutSession}
            onClick={handleBuyButton}
          >
            Comprar agora
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
  )
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({
  params,
}) => {
  const id = params.id

  const data = await stripe.products.retrieve(id, {
    expand: ['default_price'],
  })

  const price = data.default_price as Stripe.Price

  const product = {
    name: data.name,
    imageUrl: data.images[0],
    id: data.id,
    price: new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format((price.unit_amount as number) / 100),
    description: data.description,
    defaultPriceId: price.id,
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 1, // 1 hours
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  // In a real situation, you would get the list of best sellerss products from the database
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Product
