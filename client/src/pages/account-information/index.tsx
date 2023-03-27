import { ToAcronym, ToCapitalLetter } from '@/hooks/AuxiliarFunctions';
import { useState, useEffect } from 'react';

import Head from '@/components/Head';
import classNames from 'classnames';
import Axios from 'axios';

import UserStatus from '@/hooks/UserStatus';

import styles from '@/styles/account-information.module.css'

export default function Home() {
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [admin, setAdmin] = useState('')
  const [display, setDisplay] = useState(false);

  UserStatus.InsidePage();

  Axios.post('http://localhost:3001/api/user').then((response) => {
    if (response.data.message == 'USER ERROR') {
      setUsername(response.data.message);
      setEmail(response.data.message)
      setBirthdate(response.data.message);
      setAdmin(response.data.message);
    } else {
      setUsername(response.data[0].username);
      setEmail(response.data[0].email);
      setBirthdate(response.data[0].birthdate);
      setAdmin(response.data[0].admin);
    }
  });

  const editUsername = () => {
    setDisplay(!display);
  };

  const saveUsername = () => {
    setDisplay(!display);
  }

  var arrayUsername = [''];
  var arrayEmail = ['']

  const [display2, setDisplay2] = useState(false);

  const accountsHTML = [];

  const [usernames, setUsernames] = useState<string[]>(['']);
  const [emails, setEmails] = useState<string[]>(['']);
  const [admins, setAdmins] = useState<string[]>([''])


  Axios.post('http://localhost:3001/api/users').then((response) => {
    if (response.data.message == 'USER ERROR') {
      arrayUsername[0] = response.data.message;
      arrayEmail[0] = response.data.message;
    } else {
    }
  })

  const fetchUsers = async () => {
    try {
      const response = await Axios.post('http://localhost:3001/api/users');
      setDisplay2(!display2)

      for (let i = 0; i < response.data.length; i++) {
        setUsernames(prevUsernames => [...prevUsernames, response.data[i].username]);
      }

      for (let i = 0; i < response.data.length; i++) {
        setEmails(prevEmails => [...prevEmails, response.data[i].email]);
      }

      for (let i = 0; i < response.data.length; i++) {
        setAdmins(prevAdmins => [...prevAdmins, response.data[i].admin])
      }
    } catch (error) {
      console.error(error);
    }
  };

  for (let i = 1; i < usernames.length; i++) {
    const deleteUser = () => {
      Axios.post('http://localhost:3001/api/delete-user', { username: usernames[i] })
      window.location.href = '../account-information/';
    }

    const promoteUser = () => {
      Axios.post('http://localhost:3001/api/promote-user', { username: usernames[i] })
      window.location.href = '../account-information/';
    }

    accountsHTML.push(
      <div key={i} className={styles.account}>
        <div className={styles.userInfoAccount}>
          <h4>{`${ ToCapitalLetter({ username: usernames[i] }) } (${emails[i]})`}</h4>
        </div>
        <div className={styles.userInfoActions}>
          <h4 onClick={promoteUser} className={classNames(admins[i] == '1' ? styles.hideh4 : null)}>Promover</h4>
          <h4 onClick={deleteUser}>Eliminar</h4>
        </div>
      </div>
    )
  }

  return <>
    <Head
      title={`Cuenta de ${username}`}
      description=''
      ogUrl=''
      ogTitle=''
      ogDescription=''
      ogImage=''
    />

    <main className={styles.container}>
      <section className={styles.usernameSection}>
        <div>
          <h2>{ToAcronym({ username })}</h2>
          <h1 className={classNames(styles.username, display ? styles.hideUsername : styles.showUsername)}>{ToCapitalLetter({ username })}</h1>
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
            <h3>{admin == '1' ? 'Pertenece a la administración de esta página' : null}</h3>
          </div>
        </div>
        <div className={styles.purchaseHistory}>
          <h2>Historial de compras</h2>
          <div>
            <h3>El historial está vacío</h3>
          </div>
        </div>
      </section>
      <section className={classNames(styles.userAdministration, admin == '0' ? styles.hideUserAdministration : null)}>
        <h2>Administración de cuentas</h2>
        <button onClick={fetchUsers} className={classNames(styles.loadAccounts, display2 ? styles.hideLoadAccounts : styles.showLoadAccounts)}>Cargar cuentas</button>
        <div>{accountsHTML}</div>
      </section>
    </main>
  </>
}