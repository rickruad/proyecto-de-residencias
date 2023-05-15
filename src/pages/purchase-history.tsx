import { getServerSideProps } from 'src/utils/SessionAuthenticator';

import * as GetDBData from 'src/hooks/GetDBData';

import classNames from 'classnames';

import { Head, Header, Footer } from 'src/components/shared';

import styles from 'src/styles/purchase-history.module.css';

export default function PurchaseHistory({ session, sessionAuth }: { session: boolean; sessionAuth: string }) {
	const userPurchases = GetDBData.GetCurrentUserPurchases({ sessionAuth });

	const currentDate = Date.now();

	userPurchases.sort((a, b) => b.dateAdded - currentDate - (a.dateAdded - currentDate));

	const purchaseHistory = userPurchases.map((currentPurchase) => {
		let totalPrice: number = 0;

		currentPurchase.prices.forEach((price) => {
			totalPrice = totalPrice + price * 1;
		});

		return (
			<div key={currentPurchase.id} className={styles.purchaseCard}>
				<div className={styles.info}>
					<h3 className={styles.title}>{'Fecha de pedido'}</h3>
					<h3 className={styles.content}>{currentPurchase.dateAdded}</h3>
				</div>
				<div className={styles.info}>
					<h3 className={styles.title}>{'Número de pedido'}</h3>
					<h3 className={styles.content}>{currentPurchase.id}</h3>
				</div>
				<div className={styles.info}>
					<h3 className={styles.title}>{'Total'}</h3>
					<h3 className={styles.content}>{`MX$${totalPrice}`}</h3>
				</div>
			</div>
		);
	});

	if (purchaseHistory.length <= 0) {
		return (
			<>
				<Head title="Mis compras" />

				<Header session={session} sessionAuth={sessionAuth} />

				<section className={styles.purchaseHistory}>
					<h3 className={styles.title}>{'Mis compras'}</h3>
					<div className={classNames(styles.purchaseSection, styles.noPurchase)}>
						<h2>{'No has hecho ninguna compra'}</h2>
					</div>
				</section>

				<Footer />
			</>
		);
	}

	return (
		<>
			<Head title="Mis compras" />

			<Header session={session} sessionAuth={sessionAuth} />

			<section className={styles.purchaseHistory}>
				<h3 className={styles.title}>{'Mis compras'}</h3>
				<div className={styles.purchaseSection}>{purchaseHistory}</div>
			</section>

			<Footer />
		</>
	);
}

export { getServerSideProps };
