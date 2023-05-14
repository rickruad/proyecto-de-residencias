import { setCookie } from 'nookies';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		res.status(405).json({ error: 'Method not allowed' });
	} else {
		setCookie({ res }, 'session-auth', 'none', {
			maxAge: 0,
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
		});

		setCookie({ res }, 'session-id', 'none', {
			maxAge: 0,
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
		});

		res.status(200).json({ completed: true });
	}
}
