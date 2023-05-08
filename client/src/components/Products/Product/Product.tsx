import { StyledImage } from '@/hooks/StyledComponents';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

import * as Server from '@/hooks/Server';

import classNames from 'classnames';

import styles from './styles/styles.module.css';

interface ProductProps {
  id: number,
  product: string,
  image: string,
  description: string,
  price: string[],
  cashback: string,
  category: string,
  type: string,
  currentCategory: string
}

export default function Product({ id, product, image, description, price, cashback, category, type, currentCategory }: ProductProps) {
  const { username } = Server.GetCurrentUserInformation();

  const [dateAdded, setDateAdded] = useState<string>('');

  const [selectedPrice, setSelectedPrice] = useState<string>('0');
  const [selectQuantity, setSelectQuantity] = useState<number>(1);

  const [selectedOne, setSelectedOne] = useState<boolean>(false);
  const [selectedTwo, setSelectedTwo] = useState<boolean>(false);
  const [selectedThree, setSelectedThree] = useState<boolean>(false);

  useEffect(() => {
    const date = new Date();
    const dateToMili = date.getTime();
    setDateAdded(dateToMili.toString());
  }, [])

  const setPriceOne = () => {
    setSelectedOne(!selectedOne);
    setSelectedTwo(false);
    setSelectedThree(false);
    if (selectedOne !== false) {
      setSelectedPrice('0');
    } else {
      setSelectedPrice(price[0]);
    }
  }

  const setPriceTwo = () => {
    setSelectedOne(false);
    setSelectedTwo(!selectedTwo);
    setSelectedThree(false);
    if (selectedTwo !== false) {
      setSelectedPrice('0');
    } else {
      setSelectedPrice(price[1]);
    }
  }

  const setPriceThree = () => {
    setSelectedOne(false);
    setSelectedTwo(false);
    setSelectedThree(!selectedThree);
    if (selectedThree !== false) {
      setSelectedPrice('0');
    } else {
      setSelectedPrice(price[2]);
    }
  }

  const handleSelectQuantity = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectQuantity(Number(event.target.value));

    console.log(cashback)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cashbackTo100 = Number(cashback) / 100;

    if (type === 'gift-card') {
      if (selectedPrice !== '0') {
        const totalCashback = (Number(selectedPrice) * selectQuantity) * cashbackTo100;
        Server.addProductToCart({
          username: username,
          dateAdded: dateAdded,
          product: product,
          priceselected: selectedPrice,
          cashback: totalCashback.toString(),
          quantity: selectQuantity.toString()
        });
        if (typeof window !== 'undefined') {
          window.location.href = `../../products?category=${currentCategory}`
        }
      } else {
        console.log('falta seleccionar el precio');
      }
    } else {
      const totalCashback = (Number(price) * selectQuantity) * cashbackTo100;
      Server.addProductToCart({
        username: username,
        dateAdded: dateAdded,
        product: product,
        cashback: totalCashback.toString(),
        priceselected: price.toString(),
        quantity: selectQuantity.toString()
      });
      if (typeof window !== 'undefined') {
        window.location.href = `../../products?category=${currentCategory}`
      }
    }
  }
  return <>
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.card}>
        <div className={styles.startSectionCard}>
          <StyledImage src={image} className={styles.image} />
          <h2>{product}</h2>
          <h4>{description}</h4>
        </div>
        <div className={styles.endSectionCard}>
          {
            type === 'gift-card' ?
              <div className={styles.threePrices}>
                <h4>{'Precio:'}</h4>
                <div>
                  <button type='button' onClick={setPriceOne} className={classNames(styles.predefinedPrice, selectedOne ? styles.selectPredefinedPrice : null)}>{`MX$${price[0]}`}</button>
                  <button type='button' onClick={setPriceTwo} className={classNames(styles.predefinedPrice, selectedTwo ? styles.selectPredefinedPrice : null)}>{`MX$${price[1]}`}</button>
                  <button type='button' onClick={setPriceThree} className={classNames(styles.predefinedPrice, selectedThree ? styles.selectPredefinedPrice : null)}>{`MX$${price[2]}`}</button>
                </div>
              </div>
              :
              <div className={styles.onePrice}>
                <h4>{'Precio:'}</h4>
                <h4>{`MX$${price}`}</h4>
              </div>
          }
          <div className={styles.quantity}>
            <h4>Cantidad:</h4>
            <input type="number" min='1' value={selectQuantity} onChange={handleSelectQuantity} />
          </div>
          <button type='submit' className={styles.addToCart}>Agregar al carrito</button>
        </div>
      </div>
    </form>
  </>
}