import { useRouter } from 'next/router';
import { MdDelete } from 'react-icons/md';

import styles from './styles/Product.module.css';

interface ProductProps {
	productId: number;
	productName: string;
	productPrice: number;
	productQuantity: number;
}

export default function Product(props: ProductProps) {
	const { productId, productName, productPrice, productQuantity } = props;

	const router = useRouter();

	const removeProduct = async () => {
		const response = await fetch('/api/delete/product-cart', {
			method: 'POST',
			body: JSON.stringify({ id: productId }),
			headers: { 'Content-Type': 'application/json' },
		});

		if (response.ok) {
			router.reload();
		}
	};

	return (
		<>
			<article className={styles.product}>
				<div className={styles.data}>
					<MdDelete onClick={removeProduct} className={styles.mdDelete} />
					<div className={styles.productData}>
						<h3>{productName}</h3>
						<h5>{`Precio individual: ${productPrice}`}</h5>
					</div>
				</div>
				<h4>{`Cantidad: ${productQuantity}`}</h4>
			</article>
		</>
	);
}
