import AuxiliarFunctions from '@/hooks/AuxiliarFunctions';
import { useState, ChangeEvent } from 'react';

import Server from '@/hooks/Server';

import Head from '@/components/Head';
import classNames from 'classnames';

import styles from '@/styles/account-information.module.css'

export default function Home() {
  const { username, password, email, birthdate, admin } = Server.useActualUserInformation();
  const { length, usernames, emails, admins } = Server.useAllUsersInformation();
  const [newUsername, setNewUsername] = useState(username);
  const [newEmail, setNewEmail] = useState(email);
  const [newPassword, setNewPassword] = useState(password);
  const [newBirthdate, setNewBirthdate] = useState(birthdate);
  const [display, setDisplay] = useState(false);
  const accountsHTML = [];

  Server.useLoginAuthenticationInsidePage();

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewUsername(event.target.value);
  }

  const handleBirthdateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewBirthdate(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  const editInfo = () => {
    setDisplay(!display);
  };

  const saveUsername = () => {
    if (newUsername == '') {
      Server.updateUser({ email: email, password: password, username: username, birthdate: birthdate, actualEmail: email })
    } else {
      Server.updateUser({ email: email, password: password, username: newUsername, birthdate: birthdate, actualEmail: email })
    }

    if (typeof window !== 'undefined') {
      window.location.href = './account-information/';
    }
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
          <h4>{`${AuxiliarFunctions.ToCapitalLetter({ username: usernames[i] })} (${emails[i]})`}</h4>
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
          <h1 className={styles.username}>{AuxiliarFunctions.ToCapitalLetter({ username })}</h1>
        </div>
      </section>

      <div className={classNames(styles.background, display ? styles.showBackground : styles.hideBackground)}></div>
      <section className={classNames(styles.editInfo, display ? styles.showEditInfo : styles.hideEditInfo)}>
        <h3>Cambia tu información</h3>
        <div>
          <div>
            <h4>Nombre completo</h4>
            <input type="text" value={newUsername} onChange={handleUsernameChange} />
          </div>
          <div>
            <h4>Fecha de nacimiento</h4>
            <input type="date" value={newBirthdate} onChange={handleBirthdateChange} />
          </div>
          <div>
            <h4>Email</h4>
            <input type="email" value={newEmail} onChange={handleEmailChange} />
          </div>
          <div>
            <h4>Contraseña</h4>
            <input type="text" value={newPassword} onChange={handlePasswordChange} />
          </div>
          <div className={styles.buttons}>
            <button onClick={editInfo}>Cancelar</button>
            <button>Guardar</button>
          </div>
        </div>
      </section>

      <section className={styles.informationSection}>
        <div className={styles.userInfo}>
          <div className={styles.userInfoEdit}>
            <h2>Información del usuario</h2>
            <button onClick={editInfo}>Editar información</button>
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