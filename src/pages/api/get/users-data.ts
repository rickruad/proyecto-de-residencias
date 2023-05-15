import { NextApiRequest, NextApiResponse } from 'next';

import db from 'api/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		res.status(405).json({ error: 'Method not allowed' });
	} else {
		const query: string = 'SELECT * FROM users';

		db.query(query, (err, result) => {
			if (err) throw err;

			if (result.length <= 0) {
				res.status(500).json({ error: 'users not found' });
			} else {
				res.status(200).json({ users: result });
			}
		});
	}
}
