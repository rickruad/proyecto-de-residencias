import { useState } from 'react';
import AuxiliarFunctions from '@/hooks/AuxiliarFunctions';

import Image from 'next/image';
import classNames from 'classnames';

import Server from '@/hooks/Server';

import styles from './styles/styles.module.css';

export default function Header() {
  const { username } = Server.useActualUserInformation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const accountInformation = () => {
    window.location.href = './account-information/'
  }

  return <header className={styles.container}>
    <a href="./">
      <Image className={styles.image}
        src='/img/home.png'
        alt='home'
        width='100'
        height='100'
      />
    </a>
    <div>
      <a href='#'>
        <Image className={classNames(styles.image, styles.list)}
          src='/img/list.png'
          alt='list'
          width='100'
          height='100'
        />
      </a>
      <a href="#">
        <Image className={styles.image}
          src='/img/cart.png'
          alt='cart'
          width='100'
          height='100'
        />
      </a>

      <button className={styles.button} onClick={openMenu} />
      <h2 className={styles.user}>{AuxiliarFunctions.ToAcronym({ username })}</h2>
      <div className={classNames(styles.backgroundClosedMenu, isMenuOpen ? styles.backgroundOpenMenu : null)} onClick={openMenu} />
      <nav className={classNames(styles.closedMenu, isMenuOpen ? styles.openMenu : null)}>
        <h3>{AuxiliarFunctions.ToCapitalLetter({ username })}</h3>
        <div>
          <button onClick={accountInformation}>Información de la cuenta</button>
          <button onClick={Server.logout}>Cerrar sesión</button>
        </div>
      </nav>
    </div>
  </header>
}