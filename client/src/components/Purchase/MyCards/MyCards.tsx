import { MdCreditCard } from "react-icons/md";

import styles from "./styles/styles.module.css";

export default function MyCards() {
  return (
    <>
      <section className={styles.cardsSection}>
        <div className={styles.title}>
          <MdCreditCard className={styles.icon} />
          <h2>{"Mis tarjetas"}</h2>
        </div>
      </section>
    </>
  );
}
