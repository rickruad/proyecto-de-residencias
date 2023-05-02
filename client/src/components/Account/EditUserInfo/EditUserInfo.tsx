import { MdEdit } from 'react-icons/md';
import { StyledImage } from '@/hooks/StyledComponents';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

import axios from 'axios';
import * as Server from '@/hooks/Server';
import localConfig from '../../../../../local-config';

import styles from './styles/styles.module.css';

interface EditUserInfoProps {
  id: number,
  email: string,
  password: string,
  username: string,
  birthdate: string,
  profilePicture: string,
  windowTitle: string,
}

interface AxiosPostProps {
  id: number,
  oldEmail: string,
  oldPassword: string,
  oldUsername: string,
  oldBirthdate: string,
  oldProfilePicture: string,
  newEmail: string,
  newPassword: string,
  newUsername: string,
  newBirthdate: string,
  newProfilePicture: File | null
}

const AxiosPost = ({ id, oldEmail, oldPassword, oldUsername, oldBirthdate, oldProfilePicture, newEmail, newPassword, newUsername, newBirthdate, newProfilePicture }: AxiosPostProps) => {
  const { SVPORT, SVIP } = localConfig.connectionServer();

  Server.deleteUserCart({ username: oldUsername });

  const formData = new FormData();

  formData.append('id', id.toString());

  if (newUsername.length === 0) {
    formData.append('username', oldUsername);
  } else {
    formData.append('username', newUsername);
  }
  if (newBirthdate.length === 0) {
    formData.append('birthdate', oldBirthdate);
  } else {
    formData.append('birthdate', newBirthdate);
  }
  if (newEmail.length === 0) {
    formData.append('email', oldEmail);
  } else {
    formData.append('email', newEmail);
  }
  if (newPassword.length === 0) {
    formData.append('password', oldPassword);
  } else {
    formData.append('password', newPassword);
  }
  if (newProfilePicture === null) {
    formData.append('oldProfilePicture', oldProfilePicture);
  } else {
    formData.append('profilePicture', newProfilePicture);
  }

  axios.post(`http://${SVIP}:${SVPORT}/api/update-user`, formData).then((response) => {
    if (response.data.message === 'SUCCESS') {
      if (typeof window !== 'undefined') {
        window.location.href = '../../account/';
      }
    }
  })
}

export default function EditUserInfo({ id, email, password, username, birthdate, profilePicture, windowTitle }: EditUserInfoProps) {
  const { SVPORT, SVIP } = localConfig.connectionServer();

  const [currentDay, setCurrentDay] = useState<number>(0);
  const [currentYear, setCurrentYear] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<number>(0);

  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [windowStatus, setWindowStatus] = useState<boolean>(false);
  const [passwordStatus, setPasswordStatus] = useState<boolean>(false);

  const [handleUsername, setHandleUsername] = useState<string>('');
  const [handleBirthdate, setHandleBirthdate] = useState<string>('');
  const [handleEmail, setHandleEmail] = useState<string>('');
  const [handlePassword, setHandlePassword] = useState<string>('');
  const [handleProfilePicture, setHandleProfilePicture] = useState<File | null>(null);
  const [handleProfilePicturePreview, setHandleProfilePicturePreview] = useState<string>('');

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    setCurrentYear(year);
    setCurrentMonth(month);
    setCurrentDay(day);
  }, [])

  const handleChangeWindowStatus = () => {
    setWindowStatus(!windowStatus)

    setErrorStatus(false);
    setPasswordStatus(false);

    setHandleUsername('');
    setHandleBirthdate('');
    setHandleEmail('');
    setHandlePassword('');
    setHandleProfilePicture(null);
    setHandleProfilePicturePreview('');
  }

  const handleShowPassword = () => {
    setPasswordStatus(!passwordStatus);
  }

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHandleEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHandlePassword(event.target.value);
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHandleUsername(event.target.value);
  }

  const handleBirthdateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHandleBirthdate(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setHandleProfilePicture(event.target.files[0]);
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setHandleProfilePicturePreview(reader.result as string);
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (handleUsername.length === 0 && handleBirthdate.length === 0 && handleEmail.length === 0 && handlePassword.length === 0 && handleProfilePicture === null) {
      handleChangeWindowStatus();
    } else {
      if (handleEmail.length > 0) {
        axios.post(`http://${SVIP}:${SVPORT}/api/verify-email`, { email: handleEmail }).then((response) => {
          if (response.data.message === '1') {
            setErrorStatus(true);
          } else {
            AxiosPost({
              id: id,
              oldEmail: email,
              oldPassword: password,
              oldUsername: username,
              oldBirthdate: birthdate,
              oldProfilePicture: profilePicture,
              newEmail: handleEmail,
              newPassword: handlePassword,
              newUsername: handleUsername,
              newBirthdate: handleBirthdate,
              newProfilePicture: handleProfilePicture
            })
          }
        })
      } else {
        AxiosPost({
          id: id,
          oldEmail: email,
          oldPassword: password,
          oldUsername: username,
          oldBirthdate: birthdate,
          oldProfilePicture: profilePicture,
          newEmail: handleEmail,
          newPassword: handlePassword,
          newUsername: handleUsername,
          newBirthdate: handleBirthdate,
          newProfilePicture: handleProfilePicture
        })
      }
    }
  }

  return <>
    <MdEdit onClick={handleChangeWindowStatus} className={styles.button} />

    {
      windowStatus ?
        <div className={styles.background} />
        :
        null
    }
    {
      windowStatus ?
        <section className={styles.editUserInfoSection}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.windowTitle}>
              <h3>{windowTitle}</h3>
              <h5>{'(Deja en blanco las secciones que no quieras cambiar)'}</h5>
            </div>
            <div className={styles.labelInput}>
              <label>{'Nombre completo'}</label>
              <input type="text" value={handleUsername} onChange={handleUsernameChange} />
            </div>
            <div className={styles.labelInput}>
              <label>{'Fecha de nacimiento'}</label>
              <input
                type="date"
                min={`${currentYear - 100}-${currentMonth > 9 ? currentMonth : `0${currentMonth}`}-${currentDay > 9 ? currentDay : `0${currentDay}`}`}
                max={`${currentYear}-${currentMonth > 9 ? currentMonth : `0${currentMonth}`}-${currentDay > 9 ? currentDay : `0${currentDay}`}`}
                value={handleBirthdate}
                onChange={handleBirthdateChange}
              />
            </div>
            <div className={styles.labelInput}>
              <div className={styles.labelEmail}>
                <label>{'Correo electrónico'}</label>
                {
                  errorStatus ?
                    <label>{' - '}</label>
                    :
                    null
                }
                {
                  errorStatus ?
                    <label className={styles.error}>{'Correo electrónico ya registrado'}</label>
                    :
                    null
                }
              </div>
              <input type="email" value={handleEmail} onChange={handleEmailChange} />
            </div>
            <div className={styles.labelInput}>
              <div className={styles.labelPassword}>
                <label>{'Contraseña - '}</label>
                <label className={styles.showPassword} onClick={handleShowPassword}>{passwordStatus ? 'Ocultar contraseña' : 'Mostrar contraseña'}</label>
              </div>
              <input type={passwordStatus ? 'text' : 'password'} value={handlePassword} onChange={handlePasswordChange} />
            </div>
            <div className={styles.uploadImage}>
              <StyledImage src={handleProfilePicturePreview} className={styles.profilePicture} />
              <div className={styles.labelInput}>
                <label>{'Carga tu imagen de usuario'}</label>
                <h5>{'(Relación de aspecto 1:1)'}</h5>
                <input type="file" accept='.png,.jpeg,.jpg,.gif' onChange={handleFileChange} />
              </div>
            </div>
            <div className={styles.buttons}>
              <button type='submit'>{'Guardar'}</button>
              <button type='button' onClick={handleChangeWindowStatus}>{'Cancelar'}</button>
            </div>
          </form>
        </section>
        :
        null
    }
  </>
}