import Head from "@/components/Head/Head";
import Header from "@/components/Header/Header/Header";
import MyCards from "@/components/Purchase/MyCards/MyCards";
import Summary from "@/components/Purchase/Summary/Summary";
import Buy from "@/components/Purchase/Buy/Buy";
import Footer from "@/components/Footer/Footer";

import * as Server from '@/hooks/Server';

import styles from '@/styles/purchase.module.css';

export default function Purchase() {
  const { username } = Server.GetCurrentUserInformation();

  return (
    <>
      <Head title={"Comprar"} />

      <Header />

      <MyCards username={username} />

      <section className={styles.summaryPurchase}>
        <Summary />
        <Buy />
      </section>

      <Footer />
    </>
  );
}
