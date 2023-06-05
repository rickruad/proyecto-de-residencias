import { hash } from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';

import fs from 'fs';
import path from 'path';
import db from 'api/db';
import formidable from 'formidable';
import localConfig from 'root/local.config.js';

export const config = {
	api: {
		bodyParser: false,
	},
};

export const saveFile = (file: formidable.File, folder: string) => {
	const extension = path.extname(file.originalFilename ? file.originalFilename.toString() : '');
	const filename = `${Date.now()}${extension}`;
	const filepath = path.join(process.cwd(), 'uploads', folder, filename);
	const writeStream = fs.createWriteStream(filepath);

	writeStream.write(fs.readFileSync(file.filepath));
	writeStream.end();

	return new Promise((resolve, reject) => {
		writeStream.on('finish', () => {
			resolve(`/api/uploads/${folder}/${filename}`);
		});
		writeStream.on('error', (error) => {
			reject(error);
		});
	});
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'method not allowed' });
		return;
	}
	const form = new formidable.IncomingForm();

	form.parse(req, async (err, fields, files) => {
		if (err) throw err;
		const { username, birthdate, password, email } = fields;
		const { amountHashSalt, sessionAuthMultiplier } = localConfig.sessionAuthSecurity();

		let profilePicture: string | unknown | null;

		if (files.profilePicture) {
			const profilePictureFile = files.profilePicture as formidable.File;
			profilePicture = await saveFile(profilePictureFile, 'users-pictures');
		} else {
			profilePicture = null;
		}

		const sessionAuth = Date.now() * sessionAuthMultiplier;
		const encodedSessionAuth = await hash(sessionAuth.toString(), amountHashSalt);
		const encodedPassword = await hash(password.toString(), amountHashSalt);

		const query =
			'INSERT INTO users (email, password, username, birthdate, profile_picture, total_cashback, admin, session_auth) VALUES (?,?,?,?,?,?,?,?)';
		const values = [email, encodedPassword, username, birthdate, profilePicture, null, 0, encodedSessionAuth];

		db.query(query, values, (err, result) => {
			if (err) {
				res.status(409).json({ error: `${err}` });
				return;
			}
			res.status(200).json({ registered: true });
		});
	});
}
