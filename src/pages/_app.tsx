import type { AppProps } from 'next/app'
import Image from 'next/image'
import { globalStyles } from '../styles/global'
import { Container, Header } from '../styles/app'

import logoImage from '../assets/logo.svg'

globalStyles()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Header>
        <Image src={logoImage} alt="" />
      </Header>
      <Component {...pageProps} />
    </Container>
  )
}
