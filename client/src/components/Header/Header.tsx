import { useState } from 'react';
import { ToAcronym, ToCapitalLetter } from '@/hooks/AuxiliarFunctions';

import axios from 'axios';
import Image from 'next/image';
import classNames from 'classnames';

import styles from './styles/styles.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState('')

  axios.post('http://localhost:3001/api/user').then((response) => {
    if (response.data.message == 'USER ERROR') {
      setUsername(response.data.message);
    } else {
      setUsername(response.data[0].username);
    }
  })

  function openMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function accountInformation() {
    window.location.href = './account-information/'
  }

  function logout() {
    axios.post('http://localhost:3001/api/sing-out');
    window.location.href = './sing-in/';
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
      <h2 className={styles.user}>{ToAcronym({ username })}</h2>
      <div className={classNames(styles.backgroundClosedMenu, isMenuOpen ? styles.backgroundOpenMenu : null)} onClick={openMenu} />
      <nav className={classNames(styles.closedMenu, isMenuOpen ? styles.openMenu : null)}>
        <h3>{ToCapitalLetter({ username })}</h3>
        <div>
          <button onClick={accountInformation}>Información de la cuenta</button>
          <button onClick={logout}>Cerrar sesión</button>
        </div>
      </nav>
    </div>
  </header>
}