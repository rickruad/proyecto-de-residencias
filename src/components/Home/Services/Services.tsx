import { MdWorkspacesFilled } from 'react-icons/md';

import styles from './styles/services.module.css';

export default function Services() {
  return <>
    <section className={styles.servicesSection}>
      <div className={styles.servicesContainer}>
        <div className={styles.titleSection}>
          <MdWorkspacesFilled className={styles.icon} />
          <h2>{'Servicios'}</h2>
          <div className={styles.line} />
        </div>
        <h3>{'Disfruta de los servicios que te ofrecemos'}</h3>
      </div>
    </section>
  </>
}
