import { MdCreditCard } from 'react-icons/md';
import { FaMoneyCheckAlt } from 'react-icons/fa';

import * as GetDBData from 'src/hooks/GetDBData';

import styles from './styles/virtualcard.module.css';

export default function VirtualCard({ sessionAuth }: { sessionAuth: string }) {
	const userData = GetDBData.GetCurrentUserData({ sessionAuth })

	return (
		<>
			<section className={styles.section}>
				<article className={styles.container}>
					<div className={styles.titleSection}>
						<MdCreditCard className={styles.icon} />
						<h2>{'Tarjeta virtual'}</h2>
						<div className={styles.line} />
					</div>
					<h3>{'Disfruta de tu tarjeta virtual'}</h3>
					<div className={styles.card}>
						<FaMoneyCheckAlt className={styles.icon} />
						<div className={styles.info}>
							<h2>{userData?.name.toUpperCase()}</h2>
							<h3>{`Saldo en la tarjeta: $${userData?.cashback}`}</h3>
						</div>
					</div>
				</article>
			</section>
		</>
	);
}
