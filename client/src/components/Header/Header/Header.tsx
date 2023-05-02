import { useState, useEffect } from 'react';
import { StyledImage } from '@/hooks/StyledComponents';
import { MdDashboard, MdOutlineMenu } from 'react-icons/md';

import * as Server from '@/hooks/Server';
import * as AuxiliarFunctions from '@/hooks/AuxiliarFunctions';

import Link from 'next/link';
import classNames from 'classnames';

import Cart from '@/components/Header/Cart';
import Login from '@/components/Header/Login';
import HeaderMenu from '@/components/Header/HeaderMenu';

import styles from './styles/styles.module.css'

export default function Header() {
  const { width } = AuxiliarFunctions.useWindowDimensions();
  const { username, profilePicture, status } = Server.GetCurrentUserInformation();

  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [menuStatus, setMenuStatus] = useState<boolean>(false);
  const [windowStatus, setWindowStatus] = useState<boolean>(false);

  useEffect(() => {
    setWindowWidth(width)
  }, [width])

  const handleChangeMenuStatus = () => {
    setMenuStatus(!menuStatus);
  }

  const handleChangeWindowStatus = () => {
    setWindowStatus(!windowStatus);
  }

  return <>
    <header className={styles.header}>
      <section className={styles.headerContainer}>
        <h2>Proyecto de Residencias</h2>
        <div className={styles.headerButtonsContainer}>
          <Link className={styles.mdDashBoard} href={{ pathname: '../../' }}>
            <MdDashboard className={styles.icon} />
            <h5>{'Home'}</h5>
          </Link>
          <Cart />
          {
            status === 1 ?
              windowWidth >= 1367 ?
                <button onClick={handleChangeMenuStatus} className={classNames(styles.isLoginMenu, menuStatus ? styles.loginMenuActive : null)}>
                  {
                    profilePicture ?
                      <StyledImage src={profilePicture} className={styles.image} />
                      :
                      <h4 className={styles.noImage}>{AuxiliarFunctions.wordsToAcronym({ text: username })}</h4>
                  }
                  <div className={styles.info}>
                    <h4>{'¡Hola!'}</h4>
                    <h5>{AuxiliarFunctions.wordsToCapitalLetter({ text: AuxiliarFunctions.firstWord({ text: username }) })}</h5>
                  </div>
                </button>
                :
                <button onClick={handleChangeMenuStatus} className={classNames(styles.buttonMenu, menuStatus ? styles.buttonMenuActive : null)}>
                  <MdOutlineMenu className={styles.outlineMenu} />
                  <h5>{'Menu'}</h5>
                </button>
              :
              windowWidth >= 1367 ?
                <button onClick={handleChangeWindowStatus} className={classNames(styles.noLogin, windowStatus ? styles.noLoginActive : null)}>
                  <h4>{'MI CUENTA'}</h4>
                  <h5>{'Entrar'}</h5>
                </button>
                :
                <button onClick={handleChangeWindowStatus} className={classNames(styles.buttonMenu, windowStatus ? styles.buttonMenuActive : null)}>
                  <MdOutlineMenu className={styles.outlineMenu} />
                  <h5>{'Menu'}</h5>
                </button>
          }
        </div>
      </section>
    </header>
    <section className={classNames(styles.menu, menuStatus ? styles.openMenu : null)}>
      <HeaderMenu />
    </section>
    <section className={classNames(styles.loginWindow, windowStatus ? styles.openLoginWindow : null)}>
      <Login />
    </section>
  </>
}