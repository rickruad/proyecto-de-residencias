import { useState } from 'react';

import Axios from 'axios';
import classNames from 'classnames';

import Head from '@/components/Head';
import UserStatus from '@/hooks/UserStatus'

import styles from '@/styles/login.module.css';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [display, setDisplay] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  };

  UserStatus.OutsidePage();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.length <= 0 || password.length <= 0) {
      setDisplay(!display);
      setError('No se han rellenado todos los datos')
    } else {
      Axios.post('http://localhost:3001/api/sing-in', { email: email, password: password }).then((response) => {
        if (response.data.message) {
          setError(response.data.message);
          setDisplay(!display);
        } else {
          window.location.href = '../';
        }
      });
    }
  }

  function register() {
    window.location.href = './sing-up/';
  }

  function hideMessage() {
    setDisplay(!display);
  }

  return <>
    <Head
      title='Login'
      description=''
      ogUrl=''
      ogTitle=''
      ogDescription=''
      ogImage=''
    />

    <div className={styles.backgroundLogin} />

    <main className={styles.container}>
      <section>
        <h1>Bienvenido</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type='email'
                placeholder='Ingrese su email'
                value={email}
                onChange={handleEmailChange}
              />
              <input
                type='password'
                placeholder='Ingrese su contraseña'
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <button type='submit'>Iniciar Sesión</button>
          </form>
          <button onClick={register}>Registrarse</button>
        </div>
      </section>
      <div className={classNames(styles.background, display ? styles.backgroundDisplay : null)} />
      <div className={classNames(styles.errorMessage, display ? styles.errorMessageDisplay : null)}>
        <h3>{error}</h3>
        <button onClick={hideMessage}>Aceptar</button>
      </div>
    </main>
  </>
}
