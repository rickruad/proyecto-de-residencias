import { MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";

import classNames from "classnames";

import * as Server from "@/hooks/Server";

import styles from "./styles/styles.module.css";

export default function PurchaseHistoryAdmin() {
  const { IDs, usernames, products, datesAdded, datesAddedMili, totalPrices } =
    Server.GetPurchaseHistory();

  const [currentDate, setCurrentDate] = useState<number>(0);

  useEffect(() => {
    const date = new Date();
    const dateToMili = date.getTime();
    setCurrentDate(dateToMili);
  }, []);

  const filterHistory = IDs.map((id, index) => {
    return {
      id: id,
      username: usernames[index],
      product: products[index],
      dateAdded: datesAdded[index],
      dateAddedMili: datesAddedMili[index],
      totalPrice: totalPrices[index],
    };
  }).filter((username, index, self) => {
    return (
      index ===
      self.findIndex((a) => {
        return a.id === username.id;
      })
    );
  });

  filterHistory.sort(
    (a, b) => b.dateAddedMili - currentDate - (a.dateAddedMili - currentDate)
  );

  const purchaseHistory = filterHistory.map((purchase) => {
    const handleDeleteHistory = () => {
      Server.DeleteHistory({ id: purchase.id });
    };

    return (
      <>
        <div className={styles.card}>
          <div key={purchase.id} className={styles.purchaseCard}>
            <div className={styles.info}>
              <h3 className={styles.title}>{"Usuario"}</h3>
              <h3 className={styles.content}>{purchase.username}</h3>
            </div>
            <div className={styles.info}>
              <h3 className={styles.title}>{"Fecha de pedido"}</h3>
              <h3 className={styles.content}>{purchase.dateAdded}</h3>
            </div>
            <div className={styles.info}>
              <h3 className={styles.title}>{"Número de pedido"}</h3>
              <h3 className={styles.content}>{purchase.id}</h3>
            </div>
            <div className={styles.info}>
              <h3 className={styles.title}>{"Total"}</h3>
              <h3 className={styles.content}>{`MX$${purchase.totalPrice}`}</h3>
            </div>
          </div>
          <button onClick={handleDeleteHistory} className={styles.button}>
            <MdDelete className={styles.icon} />
          </button>
        </div>
      </>
    );
  });

  return (
    <>
      <section className={styles.purchaseHistorySection}>
        <h3>{"Administración de historial de compras"}</h3>
        <div
          className={classNames(
            styles.purchaseContainer,
            purchaseHistory.length > 0 ? null : styles.noPurchases
          )}
        >
          {purchaseHistory.length > 0 ? (
            purchaseHistory
          ) : (
            <h3>{"No hay historial disponible"}</h3>
          )}
        </div>
      </section>
    </>
  );
}
