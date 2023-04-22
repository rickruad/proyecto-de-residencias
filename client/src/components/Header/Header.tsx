import { useEffect, useState } from 'react';
import AuxiliarFunctions from '@/hooks/AuxiliarFunctions';

import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames';

import Server from '@/hooks/Server';

import styles from './styles/styles.module.css';

export default function Header() {
  const { username, profilePicture } = Server.useActualUserInformation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profilePictureExists, setProfilePictureExists] = useState(false);

  useEffect(() => {
    if (profilePicture) {
      setProfilePictureExists(true);
    }
  }, [profilePicture]);

  const openMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const accountInformation = () => {
    window.location.href = '../account-information/'
  }

  return <header className={styles.container}>
    <Link href='../../'>
      <Image className={styles.image}
        src='/img/home.png'
        alt='home'
        width='100'
        height='100'
        priority={true}
      />
    </Link>
    <div>
      <Link href='#'>
        <Image className={classNames(styles.image, styles.list)}
          src='/img/list.png'
          alt='list'
          width='100'
          height='100'
        />
      </Link>
      <Link href="../cart">
        <Image className={styles.image}
          src='/img/cart.png'
          alt='cart'
          width='100'
          height='100'
        />
      </Link>

      <button className={styles.button} onClick={openMenu} />
      <h2 className={classNames(styles.user, profilePictureExists ? styles.hideUser : styles.showUser)}>{AuxiliarFunctions.ToAcronym({ username })}</h2>
      <Image 
        className={classNames(styles.profilePicture, profilePictureExists ? styles.showProfilePicture : styles.hideProfilePicture)}
        src={profilePicture ? profilePicture : '/img/no-image-available(512x512).png'}
        alt={`${username} picture`}
        width='100'
        height='100'
      />
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