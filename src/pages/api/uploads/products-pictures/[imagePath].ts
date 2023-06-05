import { NextApiRequest, NextApiResponse } from 'next';

import path from 'path';
import fs from 'fs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const { imagePath } = req.query;
	let url: string = '';

	if (imagePath) {
		url = path.join(process.cwd(), 'uploads', 'products-pictures', imagePath.toString());
	}

	if (!fs.existsSync(url)) {
		return res.status(404).json({ message: 'Imagen no encontrada' });
	}

	const fileContents = fs.readFileSync(url);

	res.writeHead(200, {
		'Content-Type': 'image/png',
	});
	res.end(fileContents);
}
