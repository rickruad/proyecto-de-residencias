const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const mysql = require('mysql2/promise');

const localConfig = require('../../local.config.js');

const { DBPASSWORD, DBPORT } = localConfig.connectionDatabase();
const { amountHashSalt, sessionAuthMultiplier } = localConfig.sessionAuthSecurity();

const createDataBase = async () => {
	const dataBase = 'CREATE DATABASE IF NOT EXISTS protoapp';

	const connection = await mysql.createConnection({
		user: 'root',
		host: 'localhost',
		password: DBPASSWORD,
		port: DBPORT,
	});

	await connection.execute(dataBase);
};

const createTables = async () => {
	const usersTable = `CREATE TABLE IF NOT EXISTS users (
		id INT PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT,
		email VARCHAR(64) NOT NULL UNIQUE,
		password TEXT NOT NULL,
		username VARCHAR(64) NOT NULL UNIQUE,
		birthdate TEXT NOT NULL,
		profile_picture TEXT NULL,
		total_cashback VARCHAR(64) NULL,
		admin INT NOT NULL DEFAULT '0',
		session_auth TEXT NOT NULL
	)`;

	const productsTable = `CREATE TABLE IF NOT EXISTS products (
		id INT PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT,
		product TEXT NOT NULL,
		date_added TEXT NOT NULL,
		image LONGTEXT NOT NULL,
		description TEXT NOT NULL,
		cashback TEXT NOT NULL,
		price TEXT NOT NULL,
		category TEXT NOT NULL,
		type TEXT NOT NULL
	)`;

	const cartTable = `CREATE TABLE IF NOT EXISTS cart(
		id INT PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT,
		email TEXT NOT NULL,
		date_added TEXT NOT NULL,
		product TEXT NOT NULL,
		price_selected TEXT NOT NULL,
		cashback TEXT NOT NULL,
		quantity TEXT NOT NULL
	)`;

	const purchaseHistoryTable = `CREATE TABLE IF NOT EXISTS purchase_history (
		id INT PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT,
		username TEXT NOT NULL,
		products TEXT NOT NULL,
		products_prices TEXT NOT NULL,
		products_quantity TEXT NOT NULL,
		date TEXT NOT NULL,
		date_added TEXT NOT NULL
	)`;

	const cardsTable = `CREATE TABLE IF NOT EXISTS cards (
		id INT PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT,
		email TEXT NOT NULL,
		type TEXT NOT NULL,
		holder TEXT NOT NULL,
		number VARCHAR(64) NOT NULL UNIQUE,
		expiration_date TEXT NOT NULL,
		security_code TEXT NOT NULL,
		fullname TEXT NOT NULL,
		country TEXT NOT NULL,
		locality TEXT NOT NULL,
		first_direction TEXT NOT NULL,
		second_direction TEXT NULL,
		postal_code TEXT NOT NULL,
		number_phone TEXT NOT NULL
	)`;

	const contractsTable = `CREATE TABLE IF NOT EXISTS contracts (
		id INT PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT,
		name TEXT NOT NULL,
		description TEXT NOT NULL,
		image TEXT NOT NULL,
		service TEXT NOT NULL,
		cashback TEXT NOT NULL,
		date_added TEXT NOT NULL
	)`;

	const connection = await mysql.createConnection({
		user: 'root',
		host: 'localhost',
		password: DBPASSWORD,
		database: 'protoapp',
		port: DBPORT,
	});

	await connection.execute(usersTable);
	await connection.execute(productsTable);
	await connection.execute(cartTable);
	await connection.execute(purchaseHistoryTable);
	await connection.execute(cardsTable);
	await connection.execute(contractsTable);
};

const createAdminUser = async () => {
	const sessionAuth = Date.now() * sessionAuthMultiplier;
	const encodedSessionAuth = await bcrypt.hash(sessionAuth.toString(), amountHashSalt);
	const encodedPassword = await bcrypt.hash('admin', amountHashSalt);
	const query = `INSERT INTO users (id, username, birthdate, email, password, profile_picture, session_auth, admin) VALUES (?,?,?,?,?,?,?,?)`;
	const values = ['1', 'admin', '2000-01-01', 'admin@admin.com', encodedPassword, null, encodedSessionAuth, '1'];

	const connection = await mysql.createConnection({
		user: 'root',
		host: 'localhost',
		password: DBPASSWORD,
		database: 'protoapp',
		port: DBPORT,
	});

	try {
		await connection.query(query, values);
	} catch (err) {
		throw err;
	}
};

async function setup() {
	await createDataBase();
	await createTables();
	await createAdminUser();

	const uploadsFolder = path.join(process.cwd(), '/uploads');
	await fs.mkdir(uploadsFolder, { recursive: true });

	const usersPicturesFolder = path.join(process.cwd(), '/uploads/users-pictures');
	await fs.mkdir(usersPicturesFolder, { recursive: true });

	const productsPicturesFolder = path.join(process.cwd(), '/uploads/products-pictures');
	await fs.mkdir(productsPicturesFolder, { recursive: true });

	const contractsPicturesFolder = path.join(process.cwd(), '/uploads/contracts-pictures');
	await fs.mkdir(contractsPicturesFolder, { recursive: true });

	process.exit();
}

setup();
