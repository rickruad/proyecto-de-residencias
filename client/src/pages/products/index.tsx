import Server from '@/API/Server';

import Head from '@/components/Head';
import Header from '@/components/Header';

export default function Home() {

  Server.LoginAuthenticationInsidePage();

  return <>
    <Head title='Productos' />

    <Header />

    <h1>Hola Mundo</h1>
  </>
}