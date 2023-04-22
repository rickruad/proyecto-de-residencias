import { useState } from 'react';

import Server from "@/hooks/Server";

import Image from 'next/image';

import Head from "@/components/Head";
import Header from "@/components/Header";

export default function Cart() {
  Server.useLoginAuthenticationInsidePage();
  
  const { username } = Server.useActualUserInformation();
  const { idCart, usernameCart, productCart, priceSelectedCart, quantityCart } = Server.useGetAllCart();
  const { products, images, descriptions } = Server.useAllProducts();
  const CurrentUsername = username;
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
    return (
      <div key={currentUsername.id}>
        <Image
          src={currentUsername.image}
          alt={currentUsername.product}
          width={200}
          height={100}
          priority={true}
        />
        <h1>{currentUsername.username}</h1>
        <h1>{currentUsername.product}</h1>
        <h1>{Number(currentUsername.price) * Number(currentUsername.quantity)}</h1>
        <h1>{currentUsername.quantity}</h1>
      </div>
    )
  })

  return <>
    <Head title="Carrito" />

    <Header />

    <div>{usernameCartHTML}</div>
  </>
}