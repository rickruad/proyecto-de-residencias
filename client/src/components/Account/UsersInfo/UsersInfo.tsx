import { useState } from "react";
import { StyledImage } from "@/hooks/StyledComponents";
import { MdDelete, MdKeyboardDoubleArrowUp } from "react-icons/md";

import * as Server from "@/hooks/Server";
import * as AuxiliarFunctions from "@/hooks/AuxiliarFunctions";

import classNames from "classnames";

import EditUserInfo from "@/components/Account/EditUserInfo";

import styles from "./styles/styles.module.css";

export default function UsersInfo() {
  const {
    ids,
    emails,
    passwords,
    usernames,
    birthdates,
    profilePictures,
    statuses,
    admins,
  } = Server.GetAllUsersInformation();

  const [messageStatus, setMessageStatus] = useState<boolean>(false);
  const [messageUser, setMessageUser] = useState<string>("");
  const [messageID, setMessageID] = useState<number>(0);

  const usersToMap = usernames
    .map((username, index) => {
      return {
        id: ids[index],
        email: emails[index],
        password: passwords[index],
        username: username,
        birthdate: birthdates[index],
        profilePicture: profilePictures[index],
        status: statuses[index],
        admin: admins[index],
      };
    })
    .filter((username, index, self) => {
      return (
        index ===
        self.findIndex((a) => {
          return a.id === username.id;
        })
      );
    });

  const handleChangeMessageStatus = () => {
    setMessageStatus(!messageStatus);
    setMessageUser('');
    setMessageID(0);
  };

  const deleteUser = () => {
    Server.deleteUser({ id: messageID });
    window.location.href = "../../account/";
  };

  const users = usersToMap.map((currentUser) => {
    const promoteUser = () => {
      Server.promoteUser({ id: currentUser.id });
      window.location.href = "../../account/";
    };

    const handleChangeMessageStatus = () => {
      setMessageStatus(!messageStatus);
      setMessageUser(currentUser.username);
      setMessageID(currentUser.id);
    };

    return (
      <div key={currentUser.id} className={styles.user}>
        {currentUser.status !== 1 ? (
          <div className={styles.userInfo}>
            {currentUser.profilePicture ? (
              <StyledImage
                src={currentUser.profilePicture}
                className={styles.profilePicture}
              />
            ) : (
              <h2 className={styles.noProfilePicture}>
                {AuxiliarFunctions.wordsToAcronym({
                  text: currentUser.username,
                })}
              </h2>
            )}
            <div className={styles.userEmail}>
              <h3>
                {AuxiliarFunctions.wordsToCapitalLetter({
                  text: currentUser.username,
                })}
              </h3>
              <h5>{currentUser.email}</h5>
            </div>
          </div>
        ) : (
          <div className={classNames(styles.userInfo, styles.userActive)}>
            {currentUser.profilePicture ? (
              <StyledImage
                src={currentUser.profilePicture}
                className={styles.profilePicture}
              />
            ) : (
              <h2 className={styles.noProfilePicture}>
                {AuxiliarFunctions.wordsToAcronym({
                  text: currentUser.username,
                })}
              </h2>
            )}
            <div className={styles.userEmail}>
              <h3>
                {AuxiliarFunctions.wordsToCapitalLetter({
                  text: currentUser.username,
                })}
              </h3>
              <h5>{currentUser.email}</h5>
            </div>
          </div>
        )}
        {currentUser.status !== 1 ? (
          currentUser.admin !== 1 ? (
            <div className={styles.userButtons}>
              <EditUserInfo
                id={currentUser.id}
                email={currentUser.email}
                password={currentUser.password}
                username={currentUser.username}
                birthdate={currentUser.birthdate}
                profilePicture={currentUser.profilePicture}
                windowTitle={`Cambiando la información de ${AuxiliarFunctions.wordsToCapitalLetter(
                  { text: currentUser.username }
                )}`}
              />
              <MdKeyboardDoubleArrowUp
                onClick={promoteUser}
                className={styles.button}
              />
              <MdDelete
                onClick={handleChangeMessageStatus}
                className={styles.button}
              />
            </div>
          ) : null
        ) : null}
      </div>
    );
  });

  return (
    <>
      <div
        className={classNames(
          styles.background,
          messageStatus ? null : styles.hide
        )}
      />
      <section
        className={classNames(
          styles.message,
          messageStatus ? null : styles.hide
        )}
      >
        <div className={styles.desing}>
          <h3>{`Quieres eliminar al usuario ${messageUser}`}</h3>
          <div>
            <button onClick={deleteUser}>{"Confirmar"}</button>
            <button onClick={handleChangeMessageStatus}>{"Cancelar"}</button>
          </div>
        </div>
      </section>

      <section className={styles.usersInfoSection}>
        <h3 className={styles.sectionTitle}>{"Administración de cuentas"}</h3>
        <div className={styles.users}>{users}</div>
      </section>
    </>
  );
}
