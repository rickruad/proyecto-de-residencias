import { useEffect, useState } from 'react';

import Image from 'next/image';
import classNames from 'classnames';

import Server from '@/hooks/Server';

import Head from '@/components/Head';
import Header from '@/components/Header';

import styles from '@/styles/entertainment.module.css';

export default function Home() {
  const { length, ids, products, images, descriptions, prices, types } = Server.useAllProducts();
  let j = 0;
  let i = 1;


  const [select, setSelect] = useState(false);

  const newPrices = ['10', '20', '30']

  const productsHTML = [];
  const predefinedPriceHTML = [];

  const setPrice = () => {

  };

  Server.useLoginAuthenticationInsidePage();

  useEffect(() => {

  }, [])



  for (i; i < length; i++) {
    var splitPrices = prices[i].split(', ');
    for (j; j < 3; j++) {
      predefinedPriceHTML.push(
        <button key={j} onClick={setPrice} className={classNames(styles.predefinedPrice)}>{`MX$${splitPrices[j]}`}</button>
      )
    }
    productsHTML.push(
      <div className={styles.card} key={i}>
        <div className={styles.startSectionCard}>
          <Image className={styles.image}
            src={images[i]}
            alt={products[i]}
            width='1000'
            height='1000'
            priority={true}
          />
          <h2>{products[i]}</h2>
          <h4>{descriptions[i]}</h4>
        </div>
        <div className={styles.endSectionCard}>
          <div>
            <h4>Precio:</h4>
            {predefinedPriceHTML}
          </div>
          <div className={styles.quantity}>
            <h4>Cantidad:</h4>
            <input type="number" placeholder='1' />
          </div>
          <button className={styles.addToCart}>Agregar al carrito</button>
        </div>
      </div>
    )
  }

  return <>
    <Head title='Productos' />

    <Header />

    <section className={styles.container}>{productsHTML}</section>
  </>
}