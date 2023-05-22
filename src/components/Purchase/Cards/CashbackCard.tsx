import { useState } from 'react';
import { FaMoneyCheckAlt } from 'react-icons/fa';

import * as GetDBData from 'src/hooks/GetDBData';

import PurchaseCashbackCard from './PurchaseCashbackCard';

import styles from './styles/cashbackcard.module.css';

export default function CashbackCard({ sessionAuth }: { sessionAuth: string }) {
	const userData = GetDBData.GetCurrentUserData({ sessionAuth });

	const [purchaseStatus, setPurchaseStatus] = useState<boolean>(false);

	const purchase = () => {
		setPurchaseStatus((status) => !status);
	};

	return (
		<>
			<button onClick={purchase} className={styles.card}>
				<FaMoneyCheckAlt className={styles.icon} />
				<div className={styles.info}>
					<h2>{userData?.name.toUpperCase()}</h2>
					<h3>{`Saldo en la tarjeta: $${userData?.cashback}`}</h3>
				</div>
			</button>

			{purchaseStatus && <PurchaseCashbackCard sessionAuth={sessionAuth} handleClosePurchase={purchase} />}
		</>
	);
}
