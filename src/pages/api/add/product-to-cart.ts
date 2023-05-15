import { NextApiRequest, NextApiResponse } from 'next';

import db from 'api/db';
import formidable from 'formidable';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'method not allowed' });
	} else {
		const form = new formidable.IncomingForm();

		form.parse(req, async (err, fields, files) => {
			if (err) throw err;
			const { sessionAuth, dateAdded, product, price, cashback, quantity } = fields;

			const getEmail: string = 'SELECT * FROM users WHERE session_auth = ?';
			const saveProductInCart: string = 'email, date_added, product, price_selected, cashback, quantity';

			db.query(getEmail, [sessionAuth], (err, result) => {
				if (err) throw err;

				if (result.length <= 0) {
					res.status(500).json({ error: 'user not found' });
				} else {
					const email = result[0].email;

					const values: string[] = [email, dateAdded, product, price, cashback, quantity];

					db.query(saveProductInCart, values, (err, result) => {
						if (err) throw err;

						if (result.length <= 0) {
							res.status(500).json({ error: 'error saved product in the cart' });
						} else {
							res.status(200).json({ saved: true });
						}
					});
				}
			});
		});
	}
}
