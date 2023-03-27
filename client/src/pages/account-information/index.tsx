import AuxiliarFunctions from '@/hooks/AuxiliarFunctions';
import { useState } from 'react';

import Server from '@/hooks/Server';

import Head from '@/components/Head';
import classNames from 'classnames';

import styles from '@/styles/account-information.module.css'

export default function Home() {
  const { username, email, birthdate, admin } = Server.useActualUserInformation();
  const { length, usernames, emails, admins } = Server.useAllUsersInformation();
  const [display, setDisplay] = useState(false);
  const accountsHTML = [];

  Server.useLoginAuthenticationInsidePage();

  const editUsername = () => {
    setDisplay(!display);
  };

  const saveUsername = () => {
    setDisplay(!display);
  }

  for (let i = 1; i < length; i++) {
    const deleteUser = () => {
      Server.deleteUser({ username: usernames[i] });
      window.location.href = './account-information/';
    }

    const promoteUser = () => {
      Server.promoteUser({ username: usernames[i] });
      window.location.href = '../account-information/';
    }

    accountsHTML.push(
      <div key={i} className={styles.account}>
        <div className={styles.userInfoAccount}>
          <h4>{`${ AuxiliarFunctions.ToCapitalLetter({ username: usernames[i] }) } (${emails[i]})`}</h4>
        </div>
        <div className={styles.userInfoActions}>
          <h4 onClick={promoteUser} className={classNames(admins[i] == 1 ? styles.hideh4 : null)}>Promover</h4>
          <h4 onClick={deleteUser}>Eliminar</h4>
        </div>
      </div>
    )
  }

  return <>
    <Head title={`Cuenta de ${username}`} />

    <main className={styles.container}>
      <section className={styles.usernameSection}>
        <div>
          <h2>{AuxiliarFunctions.ToAcronym({ username })}</h2>
          <h1 className={classNames(styles.username, display ? styles.hideUsername : styles.showUsername)}>{AuxiliarFunctions.ToCapitalLetter({ username })}</h1>
          <input className={classNames(styles.input, display ? styles.showInput : styles.hideInput)} type="text" />
        </div>
        <div>
          <button onClick={editUsername} className={classNames(styles.button, display ? styles.hideButton : styles.showButton)}>Editar nombre</button>
          <button onClick={editUsername} className={classNames(styles.button, display ? styles.showButton : styles.hideButton)}>Cancelar</button>
          <button onClick={saveUsername} className={classNames(styles.button, display ? styles.showButton : styles.hideButton)}>Guardar</button>
        </div>
      </section>

      <section className={styles.informationSection}>
        <div className={styles.userInfo}>
          <div className={styles.userInfoEdit}>
            <h2>Información del usuario</h2>
            <button>Editar información</button>
          </div>
          <div>
            <h3>{`E-Mail: ${email}`}</h3>
            <h3>{`Fecha de nacimiento: ${birthdate}`}</h3>
            <h3>{admin == 1 ? 'Pertenece a la administración de esta página' : null}</h3>
          </div>
        </div>
        <div className={styles.purchaseHistory}>
          <h2>Historial de compras</h2>
          <div>
            <h3>El historial está vacío</h3>
          </div>
        </div>
      </section>
      <section className={classNames(styles.userAdministration, admin == 0 ? styles.hideUserAdministration : null)}>
        <h2>Administración de cuentas</h2>
        <div>{accountsHTML}</div>
      </section>
    </main>
  </>
}