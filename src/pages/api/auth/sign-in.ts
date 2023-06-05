import { compare } from 'bcrypt';
import { setCookie } from 'nookies';
import { NextApiRequest, NextApiResponse } from 'next';

import connection from 'api/db';
import formidable from 'formidable';

export const config = {
	api: {
		bodyParser: false,
	},
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'method not allowed' });
		return;
	}
	const form = new formidable.IncomingForm();

	form.parse(req, async (err, fields) => {
		if (err) throw err;
		const { email, password } = fields;

		connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
			if (err) throw err;

			if (result.length <= 0) {
				res.status(401).json({ auth: false });
				return;
			}

			if (await compare(password.toString(), result[0].password)) {
				res.status(401).json({ auth: false });
				return;
			}

			const sessionId = Math.random().toString(36).substring(2);

			setCookie({ res }, 'session-id', sessionId, {
				maxAge: 30 * 24 * 60 * 60,
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
			});

			const encodedSessionAuth = result[0].session_auth;

			setCookie({ res }, 'session-auth', encodedSessionAuth, {
				maxAge: 30 * 24 * 60 * 60,
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
			});

			res.status(200).json({ auth: true });
		});
	});
}
