import { useState, ChangeEvent, useEffect } from 'react';

import AuxiliarFunctions from '@/hooks/AuxiliarFunctions';

import Server, { useUpdateUser } from '@/hooks/Server';

import Head from '@/components/Head';
import classNames from 'classnames';
import Image from 'next/image';

import styles from '@/styles/account-information.module.css'

interface updateUserInfoProps {
  id: number,
  email: string,
  password: string,
  username: string,
  birthdate: string,
  profilePicture: string,
  newEmail: string,
  newPassword: string,
  newUsername: string,
  newBirthdate: string
  newProfilePicture: File | null,
}

const useUpdateUserInfo = ({ id, email, password, username, birthdate, profilePicture, newEmail, newPassword, newUsername, newBirthdate, newProfilePicture }: updateUserInfoProps) => {
  if (newEmail.length == 0) {
    newEmail = email;
  }
  if (newPassword.length == 0) {
    newPassword = password;
  }
  if (newUsername.length == 0) {
    newUsername = username;
  }
  if (newBirthdate.length == 0) {
    newBirthdate = birthdate;
  }

  const formData = new FormData();

  if (newProfilePicture) {
    formData.append("id", id.toString());
    formData.append("email", newEmail);
    formData.append("password", newPassword);
    formData.append("username", newUsername);
    formData.append("birthdate", newBirthdate);
    formData.append("image", newProfilePicture);
    formData.append("profilePicture", profilePicture);
  } else {
    formData.append("id", id.toString());
    formData.append("email", newEmail);
    formData.append("password", newPassword);
    formData.append("username", newUsername);
    formData.append("birthdate", newBirthdate);
    formData.append("profilePicture", profilePicture);
  }

  return useUpdateUser({ formData });
}

export default function Home() {
  const { id, email, password, username, birthdate, profilePicture, admin } = Server.useActualUserInformation();
  const { length, ids, emails, passwords, usernames, birthdates, profilePictures, statuses, admins } = Server.useAllUsersInformation();

  const [newId, setNewId] = useState(0);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState('');
  const [newBirthdate, setNewBirthdate] = useState('');

  const [handleEmail, setHandleEmail] = useState(email);
  const [handlePassword, setHandlePassword] = useState(password);
  const [handleUsername, setHandleUsername] = useState(username);
  const [handleBirthdate, setHandleBirthdate] = useState(birthdate);
  const [handleProfilePicture, setHandleProfilePicture] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const [isEditUserInfoShow, setIsEditUserInfoShow] = useState(false);
  const [isErrorMessageShow, setIsErrorMessageShow] = useState(false);

  const [titleEditUserInfo, setTitleEditUserInfo] = useState('');

  const [message, setMessage] = useState('');

  const accountsHTML = [];

  useEffect(() => {
    setImagePreview(profilePicture ? profilePicture : '')
  }, [profilePicture])

  Server.useLoginAuthenticationInsidePage();

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
        setImagePreview(reader.result as string);
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  const editInfo = () => {
    setIsEditUserInfoShow(!isEditUserInfoShow);
    setTitleEditUserInfo('Cambia tu información');
    setNewId(id);
    setNewEmail(email);
    setNewPassword(password);
    setNewUsername(username);
    setNewBirthdate(birthdate);
    setNewProfilePicture(profilePicture);
  };

  const useSaveNewUserInformation = () => {
    if (handleEmail.length == 0) {
      setHandleEmail(newEmail);
    }
    if (handlePassword.length == 0) {
      setHandlePassword(newPassword)
    }
    if (handleUsername.length == 0) {
      setHandleUsername(newUsername)
    }
    if (handleBirthdate.length == 0) {
      setHandleBirthdate(newBirthdate)
    }

    setMessage(useUpdateUserInfo({
      id: newId,
      email: newEmail,
      password: newPassword,
      username: newUsername,
      birthdate: newBirthdate,
      profilePicture: newProfilePicture,
      newEmail: handleEmail,
      newPassword: handlePassword,
      newUsername: handleUsername,
      newBirthdate: handleBirthdate,
      newProfilePicture: handleProfilePicture
    }))

    if (message !== 'Actualizado los valores correctamente') {
      setIsErrorMessageShow(!isErrorMessageShow);
    } else {
      if (typeof window !== 'undefined') {
        window.location.href = './account-information/';
      }
    }
  };

  for (let i = 1; i < length; i++) {
    const editUserInfo = () => {
      setIsEditUserInfoShow(!isEditUserInfoShow);
      setTitleEditUserInfo(`Cambiando la información de ${AuxiliarFunctions.ToCapitalLetter({ username: usernames[i] })}`);
      setImagePreview(profilePictures[i] ? profilePictures[i] : '')
      setNewId(ids[i]);
      setNewEmail(emails[i]);
      setNewPassword(passwords[i]);
      setNewUsername(usernames[i]);
      setNewBirthdate(birthdates[i]);
      setNewProfilePicture(profilePictures[i]);
    }

    const promoteUser = () => {
      Server.promoteUser({ username: usernames[i] });
      window.location.href = '../account-information/';
    }

    const deleteUser = () => {
      Server.deleteUser({ username: usernames[i] });
      window.location.href = './account-information/';
    }

    accountsHTML.push(
      <div key={i} className={styles.account}>
        <div className={styles.userInfoAccount}>
          <h4>{`${AuxiliarFunctions.ToCapitalLetter({ username: usernames[i] })} (${emails[i]})`}</h4>
        </div>
        <div className={styles.userInfoActions}>
          <h4 className={classNames(styles.onlineAccount, statuses[i] == 1 ? null : styles.hideText)}>Esta cuenta</h4>
          <h4 onClick={editUserInfo} className={classNames(statuses[i] == 1 ? styles.hideText : null)}>Editar</h4>
          <h4 onClick={promoteUser} className={classNames(admins[i] == 1 ? styles.hideText : null)}>Promover</h4>
          <h4 onClick={deleteUser} className={classNames(admins[i] == 1 ? styles.hideText : null)}>Eliminar</h4>
        </div>
      </div>
    )
  }

  return <>
    <Head title={`Cuenta de ${username}`} />

    <main className={styles.container}>
      <section className={styles.usernameSection}>
        <div>
          <h2 className={classNames(styles.previewWithoutImage, profilePicture ? styles.hidePreviewWithoutImage : styles.showPreviewWithoutImage)}>{AuxiliarFunctions.ToAcronym({ username })}</h2>
          <Image
            className={classNames(styles.profilePicture, profilePicture ? styles.showProfilePicture : styles.hideProfilePicture)}
            src={profilePicture ? profilePicture : '/img/no-image-available(512x512).png'}
            alt={`${username} profile picture`}
            width='100'
            height='100'
          />
          <h1 className={styles.username}>{AuxiliarFunctions.ToCapitalLetter({ username })}</h1>
        </div>
      </section>

      <div className={classNames(styles.background, isEditUserInfoShow ? styles.showBackground : styles.hideBackground)}></div>
      <section className={classNames(styles.editInfo, isEditUserInfoShow ? styles.showEditInfo : styles.hideEditInfo)}>
        <h3>{titleEditUserInfo}</h3>
        <h4>(Deja en blanco las secciones que no quieras cambiar)</h4>
        <div>
          <div>
            <h4>Nombre completo</h4>
            <input type="text" value={handleUsername} onChange={handleUsernameChange} />
          </div>
          <div>
            <h4>Fecha de nacimiento</h4>
            <input type="date" value={handleBirthdate} onChange={handleBirthdateChange} />
          </div>
          <div>
            <h4>Email</h4>
            <input type="email" value={handleEmail} onChange={handleEmailChange} />
          </div>
          <div>
            <h4>Contraseña</h4>
            <input type="text" value={handlePassword} onChange={handlePasswordChange} />
          </div>
          <div className={styles.uploadImage}>
            <Image
              className={styles.imagePreview}
              src={imagePreview ? imagePreview : '/img/no-image-available(512x512).png'}
              alt='test'
              width='100'
              height='100'
            />
            <div>
              <h4>Carga tu imagen de usuario</h4>
              <input type="file" onChange={handleFileChange} />
            </div>
          </div>
          <div className={styles.buttons}>
            <button onClick={editInfo}>Cancelar</button>
            <button onClick={useSaveNewUserInformation}>Guardar</button>
          </div>
        </div>
      </section>

      <section className={classNames(styles.errorMessage, isErrorMessageShow ? styles.showErrorMessage : styles.hideErrorMessage)}>
        <h2>{message}</h2>
        <button>Aceptar</button>
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