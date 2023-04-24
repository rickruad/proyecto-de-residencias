import { useState, FormEvent, ChangeEvent } from 'react';

import axios from 'axios';
import classNames from 'classnames';

import Server from '@/hooks/Server';

import Head from '@/components/Head';

import styles from '@/styles/login.module.css';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [display, setDisplay] = useState(false);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  };

  Server.useLoginAuthenticationOutsidePage();
  
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.length >= 0 || password.length >= 0) {
      axios.post('http://localhost:3001/api/sing-in', { email: email, password: password }).then((response) => {
        if (response.data.message) {
          setDisplay(!display);
          setError(response.data.message);
        } else {
          window.location.href = './';
        }
      })
    }
  }

  const register = () => {
    window.location.href = './sing-up/';
  }

  const hideMessage = () => {
    setDisplay(!display);
  }

  return <>
    <Head title='Login' />

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
                required={true}
                onChange={handleEmailChange}
              />
              <input
                type='password'
                placeholder='Ingrese su contraseña'
                value={password}
                required={true}
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
