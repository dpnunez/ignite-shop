import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
} from '../../styles/pages/product'

import { GetStaticProps, GetStaticPaths } from 'next'
import Image from 'next/image'
import { stripe } from '../../lib/stripe'
import Stripe from 'stripe'

interface ProductProps {
  product: {
    name: string
    imageUrl: string
    id: string
    price: string
    description: string
  }
}

const Product = ({ product }: ProductProps) => {
  return (
    <ProductContainer>
      <ImageContainer>
        <Image src={product.imageUrl} width={520} height={480} alt="" />
      </ImageContainer>

      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>

        <p>{product.description}</p>

        <button>Comprar agora</button>
      </ProductDetails>
    </ProductContainer>
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
