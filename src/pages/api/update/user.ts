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
	const filepath = path.join(process.cwd(), '/public/img', folder, filename);
	const filepathdb = `/img/${folder}/${filename}`;
	const buffer = fs.readFileSync(file.filepath);
	const writeStream = fs.createWriteStream(filepath);

	writeStream.write(buffer);
	writeStream.end();

	return new Promise((resolve, reject) => {
		writeStream.on('finish', () => {
			resolve(filepathdb);
		});
		writeStream.on('error', (error) => {
			reject(error);
		});
	});
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method not allowed' });
	} else {
		const form = new formidable.IncomingForm();

		form.parse(req, async (err, fields, files) => {
			if (err) throw err;
			const { id, email, password, username, oldUsername, birthdate, oldProfilePicture } = fields;

			let profilePicture: string | unknown;

			if (oldProfilePicture === undefined) {
				const profilePictureFile: formidable.File = files.profilePicture as formidable.File;
				profilePicture = await saveFile(profilePictureFile, 'users-pictures');
			} else {
				profilePicture = oldProfilePicture;
			}

			
		});
	}
}
