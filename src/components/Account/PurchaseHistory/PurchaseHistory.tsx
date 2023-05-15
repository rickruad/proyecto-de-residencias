import { useRouter } from 'next/router';
import { MdDelete } from 'react-icons/md';

import classNames from 'classnames';

import * as GetDBData from 'src/hooks/GetDBData';

import styles from './styles/purchasehistory.module.css';

export default function PurchaseHistory() {
	const allPurchases = GetDBData.GetAllPurchases();
	const router = useRouter();

	const currentDate = Date.now();

	allPurchases.sort((a, b) => b.dateAdded - currentDate - (a.dateAdded - currentDate));

	const purchaseHistory = allPurchases.map((purchase) => {
		const handleDeleteHistory = async () => {
			const response = await fetch('/api/delete/purchase', {
				method: 'POST',
				body: JSON.stringify({ id: purchase.id }),
				headers: { 'Content-Type': 'application/json' },
			});

			if (response.status === 200) {
				router.reload();
			}
		};

		let totalPrice: number = 0;

		purchase.prices.forEach((price: number) => {
			totalPrice = totalPrice + price * 1;
		});

		return (
			<>
				<div className={styles.card}>
					<div key={purchase.id} className={styles.purchaseCard}>
						<div className={styles.info}>
							<h3 className={styles.title}>{'Usuario'}</h3>
							<h3 className={styles.content}>{purchase.username}</h3>
						</div>
						<div className={styles.info}>
							<h3 className={styles.title}>{'Fecha de pedido'}</h3>
							<h3 className={styles.content}>{purchase.dateAdded}</h3>
						</div>
						<div className={styles.info}>
							<h3 className={styles.title}>{'Número de pedido'}</h3>
							<h3 className={styles.content}>{purchase.id}</h3>
						</div>
						<div className={styles.info}>
							<h3 className={styles.title}>{'Total'}</h3>
							<h3 className={styles.content}>{`MX$${totalPrice}`}</h3>
						</div>
					</div>
					<button onClick={handleDeleteHistory} className={styles.button}>
						<MdDelete className={styles.icon} />
					</button>
				</div>
			</>
		);
	});

	return (
		<>
			<section className={styles.purchaseHistorySection}>
				<h3>{'Administración de historial de compras'}</h3>
				<div className={classNames(styles.purchaseContainer, purchaseHistory.length > 0 ? null : styles.noPurchases)}>
					{purchaseHistory.length > 0 ? purchaseHistory : <h3>{'No hay historial disponible'}</h3>}
				</div>
			</section>
		</>
	);
}
