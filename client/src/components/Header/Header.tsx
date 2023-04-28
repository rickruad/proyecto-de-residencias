import { MdDashboard, MdShoppingCart } from 'react-icons/md';

import * as Server from '@/hooks/Server';

import Link from 'next/link';

import Account from '@/components/Account';

import styles from './styles/styles.module.css'

export default function Header() {
  const { status } = Server.GetCurrentUserInformation();

  return <>
    <header className={styles.header}>
      <section className={styles.headerContainer}>
        <h2>Proyecto de Residencias</h2>
        <div className={styles.headerButtonsContainer}>
          <Link className={styles.mdDashBoard} href={{ pathname: '../../' }}>
            <MdDashboard className={styles.icon} />
            <h5>{'Home'}</h5>
          </Link>
          <Link className={styles.mdShoppingCart} href={{ pathname: `${status === 1 ? '../../cart' : '../../'}` }} >
            <MdShoppingCart className={styles.icon} />
            <h5>{'Mi carrito'}</h5>
          </Link>
          <Account />
        </div>
      </section>
    </header>
  </>
}