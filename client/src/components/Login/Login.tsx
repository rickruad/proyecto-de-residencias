import { StyledImage } from '@/hooks/StyledComponents';
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';

import * as Server from '@/hooks/Server';

import axios from 'axios';
import localConfig from '../../../../local-config';

import styles from './styles/styles.module.css';

export default function Account() {
  const { SVIP, SVPORT } = localConfig.connectionServer();

  const [currentYear, setCurrentYear] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<number>(0);
  const [currentDay, setCurrentDay] = useState<number>(0);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [registerStatus, setRegisterStatus] = useState<boolean>(false);
  const [errorMessageStatus, setErrorMessageStatus] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  const [registerUsername, setRegisterUsername] = useState<string>('');
  const [registerBirthdate, setRegisterBirthdate] = useState<string>('');
  const [registerEmail, setRegisterEmail] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');
  const [registerProfilePicture, setRegisterProfilePicture] = useState<File | null>(null);
  const [registerProfilePicturePreview, setRegisterProfilePicturePreview] = useState<string>('');

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    setCurrentYear(year);
    setCurrentMonth(month);
    setCurrentDay(day);
  }, [])

  const handleRegisterStatus = () => {
    setRegisterStatus(!registerStatus);

    setShowPassword(false);
    setErrorMessageStatus(false);

    setErrorMessage('');

    setLoginEmail('');
    setLoginPassword('');

    setRegisterUsername('');
    setRegisterBirthdate('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterProfilePicture(null);
    setRegisterProfilePicturePreview('');
  }

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleLoginEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLoginEmail(event.target.value);
  };

  const handleLoginPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLoginPassword(event.target.value);
  };

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios.post(`http://${SVIP}:${SVPORT}/api/sing-in`, { email: loginEmail, password: loginPassword }).then((response) => {
      if (response.data.message) {
        setErrorMessageStatus(!errorMessageStatus);
        setErrorMessage(response.data.message);
      } else {
        if (typeof window !== 'undefined') {
          window.location.href = './';
        }
      }
    })
  }

  const handleRegisterUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRegisterUsername(event.target.value);
  };

  const handleRegisterBirthdateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRegisterBirthdate(event.target.value);
  };

  const handleRegisterEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRegisterEmail(event.target.value);
  };

  const handleRegisterPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRegisterPassword(event.target.value);
  };

  const handleRegisterFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setRegisterProfilePicture(event.target.files[0]);
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setRegisterProfilePicturePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    } else {
      setRegisterProfilePicturePreview('');
    }
  };

  const handleRegisterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();

    if (registerProfilePicture) {
      formData.append('thereIsProfilePicture', 'YES');
      formData.append('profilePicture', registerProfilePicture);
    } else {
      formData.append('thereIsProfilePicture', 'NO');
    }

    formData.append("username", registerUsername);
    formData.append("birthdate", registerBirthdate);
    formData.append("email", registerEmail);
    formData.append("password", registerPassword);

    Server.register({ formData });

    setRegisterStatus(!registerStatus);

    setShowPassword(false);
    setErrorMessageStatus(false);

    setErrorMessage('');

    setLoginEmail('');
    setLoginPassword('');

    setRegisterUsername('');
    setRegisterBirthdate('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterProfilePicture(null);
    setRegisterProfilePicturePreview('');
  };

  return <>
    <div className={styles.background} />
    <div className={styles.sections}>
      <div className={styles.presentation}>
        <div className={styles.image} />
        <div className={styles.blackFilter} />
        <h1>{'Bienvenido'}</h1>
        <div className={styles.registrationButton}>
          <h3>{registerStatus ? '¿Ya tienes una cuenta?' : '¿Eres nuevo en esta página?'}</h3>
          <button onClick={handleRegisterStatus}>{registerStatus ? 'Inicia sesión aquí' : 'Regístrate aquí'}</button>
        </div>
      </div>
      {
        registerStatus ?
          <div className={styles.register}>
            <form onSubmit={handleRegisterSubmit} className={styles.registerForm}>
              <h2>{'Registro nuevo'}</h2>
              <div className={styles.inputs}>
                <div className={styles.labelInput}>
                  <label>{'Nombre completo'}</label>
                  <input type="text" required={true} value={registerUsername} onChange={handleRegisterUsernameChange} />
                </div>
                <div className={styles.labelInput}>
                  <label>{'Fecha de nacimiento'}</label>
                  <input
                    type="date"
                    min={`${currentYear - 100}-${currentMonth > 9 ? currentMonth : `0${currentMonth}`}-${currentDay > 9 ? currentDay : `0${currentDay}`}`}
                    max={`${currentYear}-${currentMonth > 9 ? currentMonth : `0${currentMonth}`}-${currentDay > 9 ? currentDay : `0${currentDay}`}`}
                    value={registerBirthdate}
                    required={true}
                    onChange={handleRegisterBirthdateChange} />
                </div>
                <div className={styles.labelInput}>
                  <label>{'Correo electrónico'}</label>
                  <input type="email" required={true} value={registerEmail} onChange={handleRegisterEmailChange} />
                </div>
                <div className={styles.labelInput}>
                  <div className={styles.labelPassword}>
                    <label>{'Contraseña - '}</label>
                    <label className={styles.showPassword} onClick={handleShowPassword}>{showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}</label>
                  </div>
                  <input type={showPassword ? 'text' : 'password'} required={true} value={registerPassword} onChange={handleRegisterPasswordChange} />
                </div>
                <div className={styles.uploadImage}>
                  <StyledImage src={registerProfilePicturePreview} className={styles.profilePicture} />
                  <div className={styles.labelInput}>
                    <label>{'Carga tu imagen de usuario'}</label>
                    <h5>{'(Relación de aspecto 1:1)'}</h5>
                    <input type="file" accept='.png,.jpeg,.jpg,.gif' onChange={handleRegisterFileChange} />
                  </div>
                </div>
              </div>
              {
                errorMessageStatus ?
                  <div className={styles.errorMessage}>
                    <h3>{'errorMessage'}</h3>
                  </div>
                  :
                  null
              }
              <button type="submit">{'Registrarse'}</button>
            </form>
          </div>
          :
          <div className={styles.login}>
            <form onSubmit={handleLoginSubmit} className={styles.loginForm}>
              <h2>{'Iniciar sesión'}</h2>
              <div className={styles.inputs}>
                <div className={styles.labelInput}>
                  <label>{'Correo electrónico'}</label>
                  <input type='email' value={loginEmail} required={true} onChange={handleLoginEmailChange} />
                </div>
                <div className={styles.labelInput}>
                  <div className={styles.labelPassword}>
                    <label>{'Contraseña - '}</label>
                    <label className={styles.showPassword} onClick={handleShowPassword}>{showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}</label>
                  </div>
                  <input type={showPassword ? 'text' : 'password'} value={loginPassword} required={true} onChange={handleLoginPasswordChange} />
                </div>
              </div>
              {
                errorMessageStatus ?
                  <div className={styles.errorMessage}>
                    <h3>{errorMessage}</h3>
                  </div>
                  :
                  null
              }
              <button type='submit'>{'Iniciar Sesión'}</button>
            </form>
          </div>
      }
    </div>

  </>
}