import { useRouter } from 'next/router';
import { useState, ChangeEvent, FormEvent } from 'react';

import Image from 'next/image';
import classNames from 'classnames';

import Server from '@/hooks/Server';

import Head from '@/components/Head';
import Header from '@/components/Header';
import AddNewProduct from '@/components/AddNewProduct';

import styles from '@/styles/products.module.css';

export default function Home() {
  Server.useLoginAuthenticationInsidePage();
  const { username, admin } = Server.useActualUserInformation();
  const { products, images, descriptions, prices, categories, types } = Server.useAllProducts();

  const router = useRouter();
  const selectedCategory = router.query.category !== undefined ? router.query.category : 'NULL';
  const [selectedPrice, setSelectedPrice] = useState<string>('0');
  const [selectQuantity, setSelectQuantity] = useState<number>(1);

  const Buttons = ({ price }: { price: string[] }) => {
    const [select1, setSelect1] = useState(false);
    const [select2, setSelect2] = useState(false);
    const [select3, setSelect3] = useState(false);

    const setPrice1 = () => {
      setSelect1(!select1);
      setSelect2(false);
      setSelect3(false);
      setSelectedPrice(price[0]);
    };

    const setPrice2 = () => {
      setSelect1(false);
      setSelect2(!select2);
      setSelect3(false);
      setSelectedPrice(price[1]);
    };

    const setPrice3 = () => {
      setSelect1(false);
      setSelect2(false);
      setSelect3(!select3);
      setSelectedPrice(price[2]);
    }

    return <>
      <button type='button' onClick={setPrice1} className={classNames(styles.predefinedPrice, select1 ? styles.selectPredefinedPrice : null)}>{`MX$${price[0]}`}</button>
      <button type='button' onClick={setPrice2} className={classNames(styles.predefinedPrice, select2 ? styles.selectPredefinedPrice : null)}>{`MX$${price[1]}`}</button>
      <button type='button' onClick={setPrice3} className={classNames(styles.predefinedPrice, select3 ? styles.selectPredefinedPrice : null)}>{`MX$${price[2]}`}</button>
    </>
  }

  const handleSelectQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectQuantity(Number(event.target.value));
  }

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
      return a.product === product.product && a.category === selectedCategory;
    });
  });

  const allSelectedProducts = filterProducts.map((selectedProduct) => {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (selectedProduct.type === 'gift-card') {
        if (selectedPrice !== '0') {
          Server.addProductToCart({
            username: username,
            product: selectedProduct.product,
            priceselected: selectedPrice,
            quantity: selectQuantity.toString()
          });
          if (typeof window !== 'undefined') {
            window.location.href = `../../categories/products?category=${selectedCategory}`
          }
        } else {
          console.log('falta seleccionar el precio');
        }
      } else {
        Server.addProductToCart({
          username: username,
          product: selectedProduct.product,
          priceselected: selectedProduct.price.toString(),
          quantity: selectQuantity.toString()
        });
        if (typeof window !== 'undefined') {
          window.location.href = `../../categories/products?category=${selectedCategory}`
        }
      }

    }

    return (
      <form onSubmit={handleSubmit} key={selectedProduct.product}>
        <div className={styles.card}>
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
                <Buttons price={selectedProduct.price} />
              </div>
              :
              <div>
                <h4>Precio:</h4>
                <h4>{`MX$${selectedProduct.price}`}</h4>
              </div>
            }
            <div className={styles.quantity}>
              <h4>Cantidad:</h4>
              <input type="number" placeholder='1' min='1' value={selectQuantity} onChange={handleSelectQuantityChange} />
            </div>
            <button type='submit' className={styles.addToCart}>Agregar al carrito</button>
          </div>
        </div>
      </form>
    )
  })

  return <>
    <Head title='Productos' />

    <Header />

    <section className={styles.container}>{allSelectedProducts}</section>

    {admin === 1 ?
      <AddNewProduct category={selectedCategory.toString()} />
      :
      null
    }
    
  </>

}