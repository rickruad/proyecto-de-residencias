import mysql from 'mysql';
import { connectionDatabase } from 'root/local.config';

const { DBPASSWORD, DBPORT } = connectionDatabase();

const connection = mysql.createConnection({
	user: 'root',
	host: 'localhost',
	password: DBPASSWORD,
	database: 'proyecto-de-residencias',
	port: DBPORT,
});

export default connection;
