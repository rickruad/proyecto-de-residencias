import * as Server from '@/hooks/Server';
import * as AuxiliarFunctions from '@/hooks/AuxiliarFunctions';

import Head from '@/components/Head';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer';
import UserInfo from '@/components/Account/UserInfo';
import UsersInfo from '@/components/Account/UsersInfo';
import PurchaseHistoryAdmin from '@/components/Account/PurchaseHistoryAdmin';

import styles from '@/styles/account.module.css';

export default function Account() {
  const { username, admin } = Server.GetCurrentUserInformation();

  return <>
    <Head title={`Cuenta de ${AuxiliarFunctions.firstWord({ text: `${AuxiliarFunctions.wordsToCapitalLetter({ text: username })}` })}`} />

    <Header />

    {
      admin === 1 ?
        <section className={styles.adminSection}>
          <UserInfo />
          <UsersInfo />
          <PurchaseHistoryAdmin />
          <Footer />
        </section>
        :
        <section className={styles.noAdminSection}>
          <UserInfo />
          <Footer />
        </section>
    }    
  </>
}