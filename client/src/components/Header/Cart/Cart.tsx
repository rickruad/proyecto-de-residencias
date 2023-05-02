import { useState, useEffect } from 'react';
import { MdShoppingCart, MdClose, MdDelete } from 'react-icons/md';

import * as Server from '@/hooks/Server';

import Link from 'next/link';
import classNames from 'classnames';

import Purchase from '@/components/Header/Purchase';

import styles from './styles/styles.module.css';

export default function Cart() {
  const { username, status } = Server.GetCurrentUserInformation();
  const { idCart, usernameCart, dateAddedCart, productCart, priceSelectedCart, quantityCart } = Server.GetAllCart();

  const [windowStatus, setWindowStatus] = useState<boolean>(false);

  const [currentDate, setCurrentDate] = useState<number>(0);
  const [currentUsername, setCurrentUsername] = useState<string>('');

  var totalPrice = 0;

  useEffect(() => {
    setCurrentUsername(username);
  }, [username])

  useEffect(() => {
    const date = new Date();
    const dateToMili = date.getTime();
    setCurrentDate(dateToMili);
  }, [])

  const handleChangeWindowStatus = () => {
    setWindowStatus(!windowStatus)
  }

  if (!Array.isArray(usernameCart)) {
    return <>
      {
        status === 1 ?
          <button onClick={handleChangeWindowStatus} className={styles.mdShoppingCart} >
            <MdShoppingCart className={styles.icon} />
            <h5>{'Mi carrito'}</h5>
          </button>
          :
          <Link href={{ pathname: '../../' }} className={styles.mdShoppingCart} >
            <MdShoppingCart className={styles.icon} />
            <h5>{'Mi carrito'}</h5>
          </Link>
      }
      {
        windowStatus === true ?
          <div className={styles.background} />
          :
          null
      }
      {
        windowStatus === true ?
          <section className={styles.cart}>
            <div className={styles.headerCart}>
              <div className={styles.headerTitle}>
                <MdShoppingCart className={styles.icon} />
                <h2>{'Mis compras'}</h2>
              </div>
              <MdClose onClick={handleChangeWindowStatus} className={styles.icon} />
            </div>
            <div className={classNames(styles.allProducts, styles.noProducts)}>
              <h3>{'No hay productos agregados'}</h3>
            </div>
            <div className={styles.footerCart}>
              <div className={styles.footerInfo}>
                <h3>{'Total a pagar: MX$0'}</h3>
                <h4>{'Cashback: MX$0'}</h4>
              </div>
              <button className={classNames(styles.footerButton, styles.footerButtonNoProducts)}>{'Comprar'}</button>
            </div>
          </section>
          :
          null
      }
    </>
  }

  const filterAllCart = usernameCart.map((username, index) => {
    return {
      id: idCart[index],
      username: username,
      dateAdded: dateAddedCart[index],
      product: productCart[index],
      price: priceSelectedCart[index],
      quantity: quantityCart[index],
    }
  }).filter((username, index, self) => {
    return index === self.findIndex((a) => {
      return a.id === username.id && a.username === currentUsername
    });
  });

  if (filterAllCart.length <= 0) {
    return <>
      {
        status === 1 ?
          <button onClick={handleChangeWindowStatus} className={styles.mdShoppingCart} >
            <MdShoppingCart className={styles.icon} />
            <h5>{'Mi carrito'}</h5>
          </button>
          :
          <Link href={{ pathname: '../../' }} className={styles.mdShoppingCart} >
            <MdShoppingCart className={styles.icon} />
            <h5>{'Mi carrito'}</h5>
          </Link>
      }
      {
        windowStatus === true ?
          <div className={styles.background} />
          :
          null
      }
      {
        windowStatus === true ?
          <section className={styles.cart}>
            <div className={styles.headerCart}>
              <div className={styles.headerTitle}>
                <MdShoppingCart className={styles.icon} />
                <h2>{'Mis compras'}</h2>
              </div>
              <MdClose onClick={handleChangeWindowStatus} className={styles.icon} />
            </div>
            <div className={classNames(styles.allProducts, styles.noProducts)}>
              <h3>{'No hay productos agregados'}</h3>
            </div>
            <div className={styles.footerCart}>
              <div className={styles.footerInfo}>
                <h3>{'Total a pagar: MX$0'}</h3>
                <h4>{'Cashback: MX$0'}</h4>
              </div>
              <button className={classNames(styles.footerButton, styles.footerButtonNoProducts)}>{'Comprar'}</button>
            </div>
          </section>
          :
          null
      }
    </>
  }

  filterAllCart.sort((a, b) => (b.dateAdded - currentDate) - (a.dateAdded - currentDate));

  const allUserCart = filterAllCart.map((currentProduct) => {

    const handleAbortBuy = () => {
      Server.removeProductToCart({ id: currentProduct.id });
    }

    totalPrice = totalPrice + (currentProduct.price * currentProduct.quantity);

    return (
      <div key={currentProduct.id} className={styles.product}>
        <div className={styles.productButtonInfo}>
          <MdDelete onClick={handleAbortBuy} className={styles.trashButton} />
          <div className={styles.productInfo}>
            <h3>{currentProduct.product}</h3>
            <h5>{`Precio individual: ${currentProduct.price}`}</h5>
          </div>
        </div>
        <h4>{`Cantidad: ${currentProduct.quantity}`}</h4>
      </div>
    )
  })

  return <>
    {
      status === 1 ?
        <button onClick={handleChangeWindowStatus} className={styles.mdShoppingCart} >
          <MdShoppingCart className={styles.icon} />
          <h5>{'Mi carrito'}</h5>
        </button>
        :
        <Link href={{ pathname: '../../' }} className={styles.mdShoppingCart} >
          <MdShoppingCart className={styles.icon} />
          <h5>{'Mi carrito'}</h5>
        </Link>
    }
    {
      windowStatus === true ?
        <div className={styles.background} />
        :
        null
    }
    {
      windowStatus === true ?
        <section className={styles.cart}>
          <div className={styles.headerCart}>
            <div className={styles.headerTitle}>
              <MdShoppingCart className={styles.icon} />
              <h2>{'Mis compras'}</h2>
            </div>
            <MdClose onClick={handleChangeWindowStatus} className={styles.icon} />
          </div>
          <div className={styles.allProducts}>{allUserCart}</div>
          <div className={styles.footerCart}>
            <div className={styles.footerInfo}>
              <h3>{`Total a pagar: MX$${totalPrice}`}</h3>
              <h4>{`Cashback: MX$${totalPrice * 0.02}`}</h4>
            </div>
            {/* <Purchase /> */}
            <Link href={{ pathname: '../../buy/' }} className={styles.footerButton}>{'Comprar'}</Link>
          </div>
        </section>
        :
        null
    }
  </>
}