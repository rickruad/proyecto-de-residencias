import Server from '@/hooks/Server';

import Head from '@/components/Head';
import Header from '@/components/Header';

import styles from '@/styles/products.module.css';

export default function Home() {
  const cardHTML = [];

  Server.useLoginAuthenticationInsidePage();

  for (let i = 0; i < 10; i++) {
    cardHTML.push(
      <div key={i} className={styles.card}></div>
    )
  }

  return <>
    <Head title='Productos' />

    <Header />

    <section className={styles.container}>
      {cardHTML}
    </section>
  </>
}