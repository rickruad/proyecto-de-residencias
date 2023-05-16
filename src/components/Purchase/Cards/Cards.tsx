import { useRouter } from 'next/router';
import { RiVisaLine, RiMastercardFill } from 'react-icons/ri';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { MdCreditCard, MdOutlineCreditCardOff } from 'react-icons/md';

import * as GetDBData from 'src/hooks/GetDBData';
import * as StringUtilities from 'src/utils/StringUtilities';

import styles from './styles/cards.module.css';

export default function Cards({ sessionAuth }: { sessionAuth: string }) {
	const router = useRouter();
	const currentDate = Date.now();
	const userCart = GetDBData.GetCurrentUserCart({ sessionAuth });
	const userCards = GetDBData.GetCurrentUserCards({ sessionAuth });

	const [dateAdded, setDateAdded] = useState<string>('');

	const [userPricesCart, setUserPricesCart] = useState<string>('');
	const [userProductsCart, setUserProductsCart] = useState<string>('');
	const [userQuantityCart, setUserQuantityCart] = useState<string>('');

	const [secureCode, setSecureCode] = useState<number>(0);

	const [errorMessage, setErrorMessage] = useState<boolean>(false);

	const [purchaseMessageStatus, setPurchaseMessageStatus] = useState<boolean>(false);
	const [codeCardValue, setCodeCardValue] = useState<string>('');
	const [cardType, setCardType] = useState<string>('');
	const [cardNumber, setCardNumber] = useState<string>('');

	userCart.sort((a, b) => b.dateAdded - currentDate - (a.dateAdded - currentDate));

	useEffect(() => {
		let products: string[] = [];
		let prices: number[] = [];
		let quantitys: number[] = [];

		if (userCart.length > 0) {
			for (let i = 0; i < userCart.length; i++) {
				products.push(userCart[i].product);
				prices.push(userCart[i].priceSelected);
				quantitys.push(userCart[i].quantity);
			}
		}

		setUserPricesCart(prices.join(', '));
		setUserProductsCart(products.join(', '));
		setUserQuantityCart(quantitys.join(', '));
	}, [userCart, userCart.length]);

	useEffect(() => {
		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDay();

		setDateAdded(`${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`);
	}, []);

	const handleCodeCard = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.value.length <= 4) {
			setCodeCardValue(event.target.value);
		}
	};

	const handleHidePurchase = () => {
		setPurchaseMessageStatus(false);
		setCardType('');
		setCardNumber('');
		setCodeCardValue('');
		setSecureCode(0);
		setErrorMessage(false);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData();

		if (secureCode.toString() !== codeCardValue) {
			setErrorMessage(true);
			return;
		}

		formData.append('sessionAuth', sessionAuth);
		formData.append('products', userProductsCart);
		formData.append('productsPrices', userPricesCart);
		formData.append('productsQuantity', userQuantityCart);
		formData.append('date', dateAdded);
		formData.append('dateAdded', currentDate.toString());
		formData.append('saveCard', 'false');

		const response = await fetch('/api/add/purchase', {
			method: 'POST',
			body: formData,
		});

		if (response.status === 200) {
			router.push({ pathname: '../../purchase-history' });
		}
	};

	const cards = userCards.map((card) => {
		const handleDeleteCard = async () => {
			const response = await fetch('/api/delete/card', {
				method: 'POST',
				body: JSON.stringify({ id: card.id }),
				headers: { 'Content-Type': 'application/json' },
			});

			if (response.status === 200) {
				router.reload();
			}
		};

		const handleShowPurchase = () => {
			setPurchaseMessageStatus(true);
			setCardType(StringUtilities.wordsToCapitalLetter({ text: card.type }));
			setCardNumber(card.number.slice(-4));
			setSecureCode(card.securityCode);
		};

		return (
			<button key={card.id} onClick={handleShowPurchase} className={styles.card}>
				<MdOutlineCreditCardOff onClick={handleDeleteCard} className={styles.delete} />
				{card.type === 'visa' ? <RiVisaLine className={styles.icon} /> : <RiMastercardFill className={styles.icon} />}

				<div className={styles.info}>
					<h2>{`**** **** **** ${card.number.slice(-4)}`}</h2>
					<h3>{card.holder.toUpperCase()}</h3>
				</div>
			</button>
		);
	});

	return (
		<>
			{purchaseMessageStatus ? (
				<section className={styles.messagePurchase}>
					<div className={styles.background} />
					<form onSubmit={handleSubmit} className={styles.cartel}>
						<h3>{'Confirmar compra'}</h3>
						<h4>{`Método de pago: ${cardType} que termina en ${cardNumber}`}</h4>
						<div className={styles.labelInput}>
							<div className={styles.labelError}>
								<label>{'Código de seguridad'}</label>
								{errorMessage ? (
									<>
										<label>{' - '}</label>
										<label className={styles.error}>{'Código incorrecto'}</label>
									</>
								) : null}
							</div>
							<input
								type="text"
								required={true}
								pattern="[0-9]*"
								minLength={3}
								value={codeCardValue}
								onChange={handleCodeCard}
							/>
						</div>
						<div className={styles.buttons}>
							<button type="button" onClick={handleHidePurchase}>
								{'Cancelar'}
							</button>
							<button type="submit">{'Confirmar'}</button>
						</div>
					</form>
				</section>
			) : null}

			<section className={styles.cardsSection}>
				<div className={styles.title}>
					<MdCreditCard className={styles.icon} />
					<h2>{'Mis tarjetas'}</h2>
				</div>
				{cards.length > 0 ? (
					<div className={styles.cardsContainer}>{cards}</div>
				) : (
					<div className={styles.noCards}>
						<h2>{'No hay tarjetas guardadas'}</h2>
					</div>
				)}
			</section>
		</>
	);
}
