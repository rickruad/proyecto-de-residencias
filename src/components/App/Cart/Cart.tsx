import { MdShoppingCart, MdClose } from 'react-icons/md';

import { GetCurrentUserCart } from 'src/hooks/GetDBData';

import Link from 'next/link';
import Image from 'next/image';

import Product from './Product';

import styles from './styles/Cart.module.css';

interface CartProps {
	sessionAuth: string;
	closeCartMenu: () => void;
}

export default function Cart(props: CartProps) {
	const { sessionAuth, closeCartMenu } = props;

	const userCart = GetCurrentUserCart({ sessionAuth });

	let totalPrice = 0;
	let totalCashback = 0;

	const renderUserCart = userCart?.map((currentProduct) => {
		totalPrice += currentProduct.priceSelected * currentProduct.quantity;
		totalCashback += currentProduct.cashback * 1;

		return (
			<Product
				key={currentProduct.id}
				productId={currentProduct.id}
				productName={currentProduct.product}
				productPrice={currentProduct.priceSelected}
				productQuantity={currentProduct.quantity}
			/>
		);
	});

	return (
		<>
			<div className={styles.background} />
			<section className={styles.cart}>
				<header className={styles.header}>
					<div className={styles.title}>
						<MdShoppingCart className={styles.icon} />
						<h2>{'Mis compras'}</h2>
					</div>
					<MdClose onClick={closeCartMenu} className={styles.icon} />
				</header>
				{userCart.length > 0 ? (
					<article className={styles.renderCart}>{renderUserCart}</article>
				) : (
					<article className={styles.noCart}>
						<h3>{'No hay productos agregados'}</h3>
					</article>
				)}
				{userCart.length > 0 && (
					<footer className={styles.footer}>
						<div className={styles.data}>
							<h3>{`Total a pagar: MX$${totalPrice}`}</h3>
							<h4>{`Cashback: MX$${totalCashback.toFixed(2)}`}</h4>
						</div>
						<div className={styles.method}>
							<div className={styles.line} />
							<h4>{'Elige tu método de pago'}</h4>
							<div className={styles.line} />
						</div>
						<Link href={{ pathname: '../../purchase/' }} className={styles.button}>
							<Image
								className={styles.image}
								src={'/img/protopay-card.png'}
								alt={'protopay card'}
								width={600}
								height={300}
								priority={true}
							/>
						</Link>
					</footer>
				)}
			</section>
		</>
	);
}
