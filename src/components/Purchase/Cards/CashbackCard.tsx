import { FaMoneyCheckAlt } from 'react-icons/fa';

import * as GetDBData from 'src/hooks/GetDBData';

import styles from './styles/cashbackcard.module.css';

export default function CashbackCard({ sessionAuth }: { sessionAuth: string }) {
	const userData = GetDBData.GetCurrentUserData({ sessionAuth });
	const userCards = GetDBData.GetCurrentUserCards({ sessionAuth });

	return (
		<>
			<button className={styles.card}>
				<FaMoneyCheckAlt className={styles.icon} />
				<div className={styles.info}>
					<h2>{userData?.name.toUpperCase()}</h2>
					<h3>{`Saldo en el monedero: $${userData?.cashback}`}</h3>
				</div>
			</button>
		</>
	);
}
