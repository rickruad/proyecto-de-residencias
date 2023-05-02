import { useState, useEffect } from 'react';

import * as Server from '@/hooks/Server';

import classNames from 'classnames';

import Head from "@/components/Head";
import Header from "@/components/Header/Header";

import styles from '@/styles/purchasehistory.module.css';

export default function PurchaseHistory() {
  const { username } = Server.GetCurrentUserInformation();
  const { IDs, usernames, products, datesAdded, datesAddedMili, totalPrices } = Server.GetPurchaseHistory();

  const [currentDate, setCurrentDate] = useState<number>(0);
  const [currentUsername, setCurrentUsername] = useState<string>('');

  useEffect(() => {
    setCurrentUsername(username);
  }, [username])

  useEffect(() => {
    const date = new Date();
    const dateToMili = date.getTime();
    setCurrentDate(dateToMili);
  }, [])

  if (!Array.isArray(usernames)) {
    return <>
      <Head title='Mis compras' />

      <Header />

      <section className={styles.purchaseHistory}>
        <h3 className={styles.title}>{'Mis compras'}</h3>
        <div className={classNames(styles.purchaseSection, styles.noPurchase)}>
          <h2>{'No has hecho ninguna compra'}</h2>
        </div>
      </section>
    </>
  }

  const filterPurchaseHistory = usernames.map((username, index) => {
    return {
      ID: IDs[index],
      username: username,
      product: products[index],
      dateAdded: datesAdded[index],
      dateAddedMili: datesAddedMili[index],
      totalPrice: totalPrices[index]
    }
  }).filter((username, index, self) => {
    return index === self.findIndex((a) => {
      return a.ID === username.ID && a.username === currentUsername
    });
  });

  filterPurchaseHistory.sort((a, b) => (b.dateAddedMili - currentDate) - (a.dateAddedMili - currentDate));

  const purchaseHistory = filterPurchaseHistory.map((currentPurchase) => {
    return (
      <div key={currentPurchase.ID} className={styles.purchaseCard}>
        <div className={styles.info}>
          <h3 className={styles.title}>{'Fecha de pedido'}</h3>
          <h3 className={styles.content}>{currentPurchase.dateAdded}</h3>
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{'Número de pedido'}</h3>
          <h3 className={styles.content}>{currentPurchase.ID}</h3>
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{'Total'}</h3>
          <h3 className={styles.content}>{`MX$${currentPurchase.totalPrice}`}</h3>
        </div>
      </div>
    )
  })

  if (purchaseHistory.length <= 0) {
    return <>
      <Head title='Mis compras' />

      <Header />

      <section className={styles.purchaseHistory}>
        <h3 className={styles.title}>{'Mis compras'}</h3>
        <div className={classNames(styles.purchaseSection, styles.noPurchase)}>
          <h2>{'No has hecho ninguna compra'}</h2>
        </div>
      </section>
    </>
  }

  return <>
    <Head title='Mis compras' />

    <Header />

    <section className={styles.purchaseHistory}>
      <h3 className={styles.title}>{'Mis compras'}</h3>
      <div className={styles.purchaseSection}>{purchaseHistory}</div>
    </section>
  </>
}