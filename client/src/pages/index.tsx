import Head from '@/components/Head';
import Header from '@/components/Header';
import Footer from '@/components/Home/Footer';
import Carousel from '@/components/Home/Carousel';
import Products from '@/components/Home/Products';
import Services from '@/components/Home/Services';

export default function Home() {
  return <>
    <Head title='Proyecto de Residencias' />

    <Header />

    <Carousel />

    <Products />

    <Services />

    <Footer />
  </>
}