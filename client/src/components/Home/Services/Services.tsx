import { MdWorkspacesFilled, MdOutlineAddCircle } from 'react-icons/md';

import * as Server from '@/hooks/Server';

import classNames from 'classnames';

import styles from './styles/styles.module.css';

export default function Services() {
  const { admin } = Server.GetCurrentUserInformation();

  return <>
    <section className={styles.servicesSection}>
      <div className={styles.servicesContainer}>
        <div className={styles.titleSection}>
          <MdWorkspacesFilled className={styles.icon} />
          <h2>{'Servicios'}</h2>
          <div className={styles.line} />
          {
            admin === 1 ?
              <MdOutlineAddCircle className={classNames(styles.icon, styles.pointer)} />
              :
              null
          }
        </div>
        <h3>{'Disfruta de los servicios que te ofrecemos'}</h3>
      </div>
    </section>
  </>
}