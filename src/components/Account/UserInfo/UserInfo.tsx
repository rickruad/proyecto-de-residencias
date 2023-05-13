import { StyledImage } from '@/hooks/StyledComponents';

import * as Server from '@/hooks/Server';
import * as AuxiliarFunctions from '@/hooks/AuxiliarFunctions';

import EditUserInfo from '@/components/Account/EditUserInfo';

import styles from './styles/styles.module.css';

export default function UserInfo() {
  const { id, email, password, username, birthdate, profilePicture, admin } = Server.GetCurrentUserInformation();

  return <>
    <section className={styles.userInfoSection}>
      <div className={styles.profilePictureUsernameEdit}>
        <div className={styles.profilePictureUsername}>
          {
            profilePicture ?
              <StyledImage src={profilePicture} className={styles.profilePicture} />
              :
              <h2 className={styles.noProfilePicture}>{AuxiliarFunctions.wordsToAcronym({ text: username })}</h2>
          }
          <h2 className={styles.username}>{AuxiliarFunctions.wordsToCapitalLetter({ text: username })}</h2>
        </div>
        <EditUserInfo
          id={id}
          email={email}
          password={password}
          username={username}
          birthdate={birthdate}
          profilePicture={profilePicture}
          windowTitle={'Cambia tu información'}
        />
      </div>
      <div className={styles.otherInformation}>
        <h3>{`Fecha de nacimiento: ${birthdate}`}</h3>
        <h3>{`Correo electrónico: ${email}`}</h3>
        {
          admin ?
            <h3>{'Pertenece a la administración de esta página'}</h3>
            :
            null
        }
      </div>
    </section>
  </>
}