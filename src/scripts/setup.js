const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const localConfig = require('../../local.config.js');

const { DBPASSWORD, DBPORT } = localConfig.connectionDatabase();
const { amountHashSalt, sessionAuthMultiplier } = localConfig.sessionAuthSecurity();

const proyectoDeResidenciasDataBase = 'CREATE DATABASE IF NOT EXISTS protoapp';

const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
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

const createProductsTable = `CREATE TABLE IF NOT EXISTS products (
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

const createCartTable = `CREATE TABLE IF NOT EXISTS cart(
	id INT PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT,
	email TEXT NOT NULL,
	date_added TEXT NOT NULL,
	product TEXT NOT NULL,
	price_selected TEXT NOT NULL,
	cashback TEXT NOT NULL,
	quantity TEXT NOT NULL
)`;

const createPurchaseHistoryTable = `CREATE TABLE IF NOT EXISTS purchase_history (
	id INT PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT,
	username TEXT NOT NULL,
	products TEXT NOT NULL,
	products_prices TEXT NOT NULL,
	products_quantity TEXT NOT NULL,
	date TEXT NOT NULL,
	date_added TEXT NOT NULL
)`;

const createCardsTable = `CREATE TABLE IF NOT EXISTS cards (
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

const createContractsTable = `CREATE TABLE IF NOT EXISTS contracts (
	id INT PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT,
	name TEXT NOT NULL,
	description TEXT NOT NULL,
	image TEXT NOT NULL,
	service TEXT NOT NULL,
	cashback TEXT NOT NULL,
	date_added TEXT NOT NULL
)`;

const createDataBase = mysql.createConnection({
	user: 'root',
	host: 'localhost',
	password: DBPASSWORD,
	port: DBPORT,
});

createDataBase.connect();

createDataBase.query(proyectoDeResidenciasDataBase, (err) => {
	if (err) throw err;
});

createDataBase.end();

setTimeout(() => {
	const createTables = mysql.createConnection({
		user: 'root',
		host: 'localhost',
		password: DBPASSWORD,
		database: 'protoapp',
		port: DBPORT,
	});

	createTables.connect();

	createTables.query(createUsersTable, (err) => {
		if (err) throw err;
	});

	createTables.query(createProductsTable, (err) => {
		if (err) throw err;
	});

	createTables.query(createCartTable, (err) => {
		if (err) throw err;
	});

	createTables.query(createPurchaseHistoryTable, (err) => {
		if (err) throw err;
	});

	createTables.query(createCardsTable, (err) => {
		if (err) throw err;
	});

	createTables.query(createContractsTable, (err) => {
		if (err) throw err;
	});

	createTables.end();
}, 2000);

setTimeout(async () => {
	const createAdmin = mysql.createConnection({
		user: 'root',
		host: 'localhost',
		password: DBPASSWORD,
		database: 'proyecto_de_residencias',
		port: DBPORT,
	});

	createAdmin.connect();

	const sessionAuth = Date.now() * sessionAuthMultiplier;
	const encodedSessionAuth = await bcrypt.hash(sessionAuth.toString(), amountHashSalt);
	const encodedPassword = await bcrypt.hash('admin', amountHashSalt);

	const query =
		'INSERT INTO users (id, username, birthdate, email, password, profile_picture, session_auth, admin) VALUES (?,?,?,?,?,?,?,?)';

	const values = ['1', 'admin', '2000-01-01', 'admin@admin.com', encodedPassword, null, encodedSessionAuth, '1'];

	createAdmin.query(query, values, (err) => {
		if (err) throw err;
	});

	createAdmin.end();
}, 2000);

const uploadsFolder = path.join(process.cwd(), '/uploads');
fs.mkdir(uploadsFolder, { recursive: true }, (err) => {
	if (err) throw err;
});

const usersPicturesFolder = path.join(process.cwd(), '/uploads/users-pictures');
fs.mkdir(usersPicturesFolder, { recursive: true }, (err) => {
	if (err) throw err;
});

const productsPicturesFolder = path.join(process.cwd(), '/uploads/products-pictures');
fs.mkdir(productsPicturesFolder, { recursive: true }, (err) => {
	if (err) throw err;
});

const contractsPictures = path.join(process.cwd(), '/uploads/contracts-pictures');
fs.mkdir(contractsPictures, { recursive: true }, (err) => {
	if (err) throw err;
});
