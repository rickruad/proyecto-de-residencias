import { useState, useEffect } from 'react';

import Server from "@/hooks/Server";

import Image from 'next/image';
import styled from 'styled-components';

import Head from "@/components/Head";
import Header from "@/components/Header";

import styles from '@/styles/cart.module.css';

const ImageProduct = styled.div<{ image: string }>`
  background-image: url(${props => props.image});
`;

export default function Cart() {
  Server.useLoginAuthenticationInsidePage();

  const { username } = Server.useActualUserInformation();
  const { idCart, usernameCart, productCart, priceSelectedCart, quantityCart } = Server.useGetAllCart();
  const { products, images, descriptions } = Server.useAllProducts();
  const CurrentUsername = username;

  var totalPrice = 0;

  var indexProduct = 0;

  const usernameCartMap = usernameCart.map((username, index) => {

    for (let i = 0; i < products.length; i++) {
      if (productCart[index] === products[i]) {
        indexProduct = i;
        break;
      }
    }

    return {
      id: idCart[index],
      username: username,
      product: productCart[index],
      price: priceSelectedCart[index],
      quantity: quantityCart[index],
      image: images[indexProduct],
      description: descriptions[indexProduct]
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

    totalPrice = totalPrice + Number(currentUsername.price);

    return (
      <div key={currentUsername.id} className={styles.card}>
        <div className={styles.startSectionCard}>
          <ImageProduct image={currentUsername.image} className={styles.imageProduct} />
          <h2>{currentUsername.product}</h2>
          <h4>{currentUsername.description}</h4>
        </div>
        <div className={styles.endSectionCard}>
          <h4>{`Cantidad: ${currentUsername.quantity}`}</h4>
          <h4>{`Precio: ${currentUsername.price}`}</h4>
          <button className={styles.deleteProductButton} onClick={handleAbortBuy}>Borrar</button>
        </div>
      </div>
    )
  })

  return <>
    <Head title="Carrito" />

    <Header />

    <section className={styles.sectionCart}>
      <div className={styles.showProducts}>
        <button className={styles.buyButton}>Comprar</button>
        <div className={styles.products}>{usernameCartHTML}</div>
      </div>
    </section>

  </>
}