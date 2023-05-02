import Head from '@/components/Head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Carousel from '@/components/Home/Carousel';
import Services from '@/components/Home/Services';
import Categories from '@/components/Home/Categories';

export default function Home() {
  return <>
    <Head title='Proyecto de Residencias' />

    <Header />

    <Carousel />

    <Categories />

    <Services />

    <Footer />
  </>
}