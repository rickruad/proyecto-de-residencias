import Server from '@/hooks/Server';

import Head from '@/components/Head';
import Header from '@/components/Header';

export default function Home() {

  Server.useLoginAuthenticationInsidePage();

  return <>
    <Head title='Productos' />

    <Header />

    <h1>Hola Mundo</h1>
  </>
}