import { MdWysiwyg, MdMail } from "react-icons/md";

import * as Server from "@/hooks/Server";

import styles from "./styles/styles.module.css";

export default function Summary() {
  const { email, username } = Server.GetCurrentUserInformation();
  const { idCart, usernameCart, priceSelectedCart, cashbacks, quantityCart } = Server.GetAllCart();

  const currentUsername = username;

  let totalPrice = 0;
  let totalCashback = 0;

  const summary = idCart.map((id, index) => {
    return {
      id: id,
      username: usernameCart[index],
      price: priceSelectedCart[index],
      quantity: quantityCart[index],
      cashback: cashbacks[index]
    }
  }).filter((username, index, self) => {
    return (
      index ===
      self.findIndex((a) => {
        return a.id === username.id && a.username === currentUsername;
      })
    );
  });

  summary.forEach((summary) => {
    totalPrice = totalPrice + (summary.price * summary.quantity);
    totalCashback = totalCashback + (summary.cashback * 1);
  })

  return (
    <>
      <section className={styles.summarySection}>
        <div className={styles.title}>
          <MdWysiwyg className={styles.icon} />
          <h2>{"Resumen"}</h2>
        </div>
        <div className={styles.cartel}>
          <div className={styles.info}>
            <h4>{"Comprador"}</h4>
            <div className={styles.email}>
              <MdMail className={styles.icon} />
              <h4>{email}</h4>
            </div>
          </div>
          <div className={styles.info}>
            <h4>{"Monto"}</h4>
            <h4 className={styles.text}>{`MX$${totalPrice}`}</h4>
          </div>
          <div className={styles.info}>
            <h4>{"Cashback"}</h4>
            <h4 className={styles.text}>{`MX$${totalCashback}`}</h4>
          </div>
        </div>
      </section>
    </>
  );
}
