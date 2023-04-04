import { useState, FormEvent, ChangeEvent } from 'react';

import Image from 'next/image';
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
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setProfilePicture(event.target.files[0]);
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.length <= 0 || password.length <= 0 || username.length <= 0 || birthdate.length <= 0) {
      setDisplay(!display);
    } else {
      if (profilePicture) {
        const formData = new FormData();
        formData.append("image", profilePicture);
        formData.append("username", username);
        formData.append("birthdate", birthdate);
        formData.append("email", email);
        formData.append("password", password);

        Server.register({ formData });

        if (typeof window !== 'undefined') {
          window.location.href = '../sing-in/'
        }
      } else {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("birthdate", birthdate);
        formData.append("email", email);
        formData.append("password", password);

        Server.register({ formData });

        if (typeof window !== 'undefined') {
          window.location.href = '../sing-in/'
        }
      }
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
            <input
              type="date"
              min={`${year - 100}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`}
              max={`${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`}
              value={birthdate}
              onChange={handleBirthdateChange} />
          </div>
          <div>
            <h4>Email</h4>
            <input type="email" value={email} onChange={handleEmailChange} />
          </div>
          <div>
            <h4>Contraseña</h4>
            <input type="text" value={password} onChange={handlePasswordChange} />
          </div>
          <div className={styles.uploadImage}>
            <Image
              className={styles.imagePreview}
              src={imagePreview ? imagePreview : '/img/no-image-available.png'}
              alt='test'
              width='100'
              height='100'
            />
            <div>
              <h4>Carga tu imagen de usuario</h4>
              <h5>(La relación de aspecto de la imágen tiene que ser de 1:1)</h5>
              <input type="file" onChange={handleFileChange} />
            </div>
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