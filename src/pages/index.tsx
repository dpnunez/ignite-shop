import Image from 'next/image'

import { useKeenSlider } from 'keen-slider/react'

import { HomeContainer, Product } from '../styles/pages/home'

import 'keen-slider/keen-slider.min.css'
import { GetStaticProps } from 'next'
import { Stripe } from 'stripe'
import { stripe } from '../lib/stripe'
import Head from 'next/head'

interface HomeProps {
  products: {
    name: string
    imageUrl: string
    id: string
    price: string
  }[]
}

const Home = (props: HomeProps) => {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  })

  console.log(props)

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>
      <HomeContainer ref={sliderRef} className="keen-slider">
        {props.products.map((product) => (
          <Product
            prefetch={false}
            href={`/product/${product.id}`}
            key={product.id}
            className="keen-slider__slide"
          >
            <Image src={product.imageUrl} width={520} height={480} alt="" />

            <footer>
              <strong>{product.name}</strong>
              <span>{product.price}</span>
            </footer>
          </Product>
        ))}
      </HomeContainer>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data: stripeData } = await stripe.products.list({
    expand: ['data.default_price'],
  })

  const products = stripeData.map((product) => {
    const price = product.default_price as Stripe.Price

    return {
      name: product.name,
      imageUrl: product.images[0],
      id: product.id,
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format((price.unit_amount as number) / 100),
    }
  })

  return {
    props: {
      products,
    },
  }
}

export default Home
