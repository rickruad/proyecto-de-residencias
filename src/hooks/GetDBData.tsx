import { useState, useEffect } from 'react';

type User = {
	id: number;
	name: string;
	email: string;
	password: string;
	birthdate: string;
	picture: string;
	cashback: string;
	admin: number;
};

type Cart = {
	id: number;
	product: string;
	priceSelected: number;
	cashback: number;
	quantity: number;
	dateAdded: number;
};

type UserDB = {
	id: number;
	email: string;
	username: string;
	password: string;
	birthdate: string;
	profile_picture: string;
	total_cashback: string;
	admin: number;
};

type CartDB = {
	id: number;
	product: string;
	price_selected: number;
	cashback: number;
	quantity: number;
	date_added: number;
};

export const GetCurrentUserData = ({ sessionAuth }: { sessionAuth: string }) => {
	const [userData, setUserData] = useState<User>();

	useEffect(() => {
		fetch('/api/get/user-data', {
			method: 'POST',
			body: JSON.stringify({ sessionAuth }),
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.user) {
					const db: UserDB = data.user as UserDB;

					setUserData({
						id: db.id,
						name: db.username,
						email: db.email,
						password: db.password,
						birthdate: db.birthdate,
						picture: db.profile_picture,
						cashback: db.total_cashback,
						admin: db.admin,
					});
				}
			});
	}, [sessionAuth]);

	return userData;
};

export const GetCurrentUserCart = ({ sessionAuth }: { sessionAuth: string }) => {
	const [userCart, setUserCart] = useState<Cart[]>([]);

	useEffect(() => {
		const currentTime: number = Date.now();

		fetch('/api/get/user-cart', {
			method: 'POST',
			body: JSON.stringify({ sessionAuth }),
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.error) {
					console.log(data.error);
				} else {
					console.log('has cart');

					const getDBCart = data.cart.map((product: CartDB) => {
						return {
							id: product.id,
							product: product.product,
							priceSelected: product.price_selected,
							cashback: product.cashback,
							quantity: product.quantity,
							dateAdded: product.date_added,
						};
					});

					getDBCart.sort((a: any, b: any) => b.dateAdded - currentTime - (a.dateAdded - currentTime));

					setUserCart(getDBCart);
				}
			});
	}, [sessionAuth]);

	return userCart;
};
