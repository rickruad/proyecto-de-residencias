import Server from "@/hooks/Server";

import Link from 'next/link';

import Head from "@/components/Head";
import Header from "@/components/Header";

import styles from '@/styles/cart.module.css';

export default function Cart() {
  Server.useLoginAuthenticationInsidePage();

  const { username } = Server.useActualUserInformation();
  const { idCart, usernameCart, productCart, priceSelectedCart, quantityCart } = Server.useGetAllCart();
  const CurrentUsername = username;

  var totalPrice = 0;

  const usernameCartMap = usernameCart.map((username, index) => {

    return {
      id: idCart[index],
      username: username,
      product: productCart[index],
      price: priceSelectedCart[index],
      quantity: quantityCart[index],
    }
  }).filter((username, index, self) => {
    return index === self.findIndex((a) => {
      return a.id === username.id && a.username === CurrentUsername
    });
  });

  const usernameCartHTML = usernameCartMap.map((currentUsername) => {

    const handleAbortBuy = () => {
      Server.removeProductToCart({ id: Number(currentUsername.id) });
    }

    totalPrice = totalPrice + (Number(currentUsername.price) * Number(currentUsername.quantity));

    return (
      <div key={currentUsername.id} className={styles.card}>
        <div className={styles.priceNameSection}>
          <h3>{currentUsername.product}</h3>
          <h5>{`Precio individual: ${Number(currentUsername.price) * Number(currentUsername.quantity)}`}</h5>
        </div>
        <h4>{`Cantidad: ${currentUsername.quantity}`}</h4>
        <button className={styles.deleteProductButton} onClick={handleAbortBuy}>Borrar</button>
      </div>
    )
  })

  return <>
    <Head title="Carrito" />

    <Header />

    <section className={styles.sectionCart}>

      <div className={styles.showProducts}>
        <div className={styles.buy}>
          <div className={styles.infoBuy}>
            <h3>{`Total a pagar: MX$${totalPrice}`}</h3>
            <h4>{`Cashback: MX$${totalPrice * 0.02}`}</h4>
          </div>
          <Link href={{ pathname: '../../cart/buy' }} className={styles.buyButton}>Comprar</Link>
        </div>
        <div className={styles.products}>{usernameCartHTML}</div>
      </div>
    </section>

  </>
}