import { useState, FormEvent, ChangeEvent } from 'react';

import classNames from 'classnames';

import Server from '@/hooks/Server';

import Head from '@/components/Head';

import styles from '@/styles/register.module.css';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [display, setDisplay] = useState(false);

  Server.useLoginAuthenticationOutsidePage();

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleBirthdateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBirthdate(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.length <= 0 || password.length <= 0 || username.length <= 0 || birthdate.length <= 0) {
      setDisplay(!display);
    } else {
      Server.register({ username: username, birthdate: birthdate, email: email, password: password });
      window.location.href = './sing-in/';
    }
  };

  const hideDisplay = () => {
    setDisplay(!display);
  };

  return <>
    <Head title="Register" />

    <main className={styles.container}>
      <section>
        <h2>Complete las siguientes casillas para registrarse</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <h4>Nombre completo</h4>
            <input type="text" value={username} onChange={handleUsernameChange} />
          </div>
          <div>
            <h4>Fecha de nacimiento</h4>
            <input type="date" value={birthdate} onChange={handleBirthdateChange} />
          </div>
          <div>
            <h4>Email</h4>
            <input type="email" value={email} onChange={handleEmailChange} />
          </div>
          <div>
            <h4>Contraseña</h4>
            <input type="text" value={password} onChange={handlePasswordChange} />
          </div>
          <button type="submit">Registrarse</button>
        </form>
      </section>
      <div className={classNames(styles.background, display ? styles.backgroundDisplay : null)}></div>
      <div className={classNames(styles.errorMessage, display ? styles.errorMessageDisplay : null)}>
        <h3>No se han rellenado todos los datos</h3>
        <button onClick={hideDisplay}>Aceptar</button>
      </div>
    </main>
  </>
}