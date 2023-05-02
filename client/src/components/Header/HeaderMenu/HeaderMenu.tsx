import { StyledImage } from '@/hooks/StyledComponents';
import { MdPowerSettingsNew, MdInfoOutline, MdOutlineListAlt } from 'react-icons/md';

import * as Server from '@/hooks/Server';
import * as AuxiliarFunctions from '@/hooks/AuxiliarFunctions';

import Link from 'next/link';
import classNames from 'classnames';

import styles from './styles/styles.module.css';

export default function HeaderMenu() {
  const { username, profilePicture } = Server.GetCurrentUserInformation();

  const handleLogout = () => {
    Server.Logout();
  }

  return <>
      <div className={classNames(styles.isLoginMenu)}>
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
      </div>
      <Link className={styles.button} href={{ pathname: './account/' }}>
        <MdInfoOutline className={styles.icon} />
        <h4 className={styles.text}>{'Información'}</h4>
      </Link>
      <Link className={styles.button} href={{ pathname: './' }}>
        <MdOutlineListAlt className={styles.icon} />
        <h4 className={styles.text}>{'Mis compras'}</h4>
      </Link>
      <Link onClick={handleLogout} className={styles.button} href={{ pathname: './' }}>
        <MdPowerSettingsNew className={styles.icon} />
        <h4 className={styles.text}>{'Cerrar Sesión'}</h4>
      </Link>
  </>
}