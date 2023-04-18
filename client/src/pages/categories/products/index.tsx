import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import Image from 'next/image';
import classNames from 'classnames';

import Server from '@/hooks/Server';

import Head from '@/components/Head';
import Header from '@/components/Header';
import AddNewProduct from '@/components/AddNewProduct';

import styles from '@/styles/products.module.css';

const Button = ({ price }: { price: string }) => {
  const [select, setSelect] = useState(false);

  const setPrice = () => {
    setSelect(true);
  };

  return <button onClick={setPrice} className={classNames(styles.predefinedPrice, select ? styles.selectPredefinedPrice : null)}>{`MX$${price}`}</button>
}

export default function Home() {
  const router = useRouter();
  const inRouter = router.query.category;
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (inRouter !== undefined) {
      setCategory(inRouter.toString());
    }
  }, [inRouter]);

  const { products, images, descriptions, prices, categories, types } = Server.useAllProducts();

  Server.useLoginAuthenticationInsidePage();

  const filterProducts = products.map((product, index) => {
    return {
      product: product,
      image: images[index],
      description: descriptions[index],
      price: prices[index].split(', '),
      category: categories[index],
      type: types[index]
    }
  }).filter((product, index, self) => {
    return index === self.findIndex((a) => {
      return a.product === product.product && a.category === category;
    });
  });

  const allSelectedProducts = filterProducts.map((selectedProduct) => {
    return (
      <div className={styles.card} key={selectedProduct.product}>
        <div className={styles.startSectionCard}>
          <Image
            className={styles.image}
            src={selectedProduct.image}
            alt={selectedProduct.product}
            width={1000}
            height={1000}
            priority={true}
          />
          <h2>{selectedProduct.product}</h2>
          <h4>{selectedProduct.description}</h4>
        </div>
        <div className={styles.endSectionCard}>
          {selectedProduct.type === 'gift-card' ?
            <div>
              <h4>Precio:</h4>
              <Button price={selectedProduct.price[0]} />
              <Button price={selectedProduct.price[1]} />
              <Button price={selectedProduct.price[2]} />
            </div>
            :
            <div>
              <h4>Precio:</h4>
              <h4>{`MX$${selectedProduct.price}`}</h4>
            </div>
          }
          <div className={styles.quantity}>
            <h4>Cantidad:</h4>
            <input type="number" placeholder='1' min='1' />
          </div>
          <button className={styles.addToCart}>Agregar al carrito</button>
        </div>
      </div>
    )
  })

  return <>
    <Head title='Productos' />

    <Header />

    <section className={styles.container}>{allSelectedProducts}</section>

    <AddNewProduct category={category}/>
  </>

}