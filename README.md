# Proyecto de residencias
Este es un proyecto realizado en React con NextJS y TypeScript
## Requisitos
- Tener instalado MySQL Workbench con MySQL Server.
> En la instalación de MySQL Workbench, al momento de llegar a la configuración del MySQL Server, en el apartado de métodos de autenticación, seleccione la opción "Use Legacy Authentication Method", puesto que el módulo MySQL para React no soporta aún el nuevo método de autenticación.
- Tener instalado Node.js
- Tener instalado Visual Studio Code o algún otro editor de código.
## Cómo ejecutar este proyecto
1. En MySQL Workbench, cree un schema, recomiendo de nombre "proyecto-de-residencias".
2. Luego, desactive la opción "Safe Updates" en Edit > Preferences > SQL Editor
3. Ahora descargue el proyecto en [releases](https://github.com/rickruad/proyecto-de-residencias/releases), descomprimaló y abra la carpeta con Visual Studio Code.
4. Cree un archivo en la raíz del proyecto llamado "local-config.js" y copie el siguiente código modificando lo que está comentado.
```js
// local-config.js

export function connectionDatabase() {
	const DBPASSWORD = 'password'; // Acá va la contraseña de su local instance
	const DBNAME = 'schema-name'; // Acá va el nombre de su schema, siguiendo el nombre recomendado sería "proyecto-de-residencias"
	const DBPORT = 3306; // Acá va el puerto que utiliza MySQL Server, actualmente está puesto el número por default, si no lo modificó, dejeló así
	
	return {
		DBPASSWORD,
		DBNAME,
		DBPORT
	}
}

export function connectionServer() {
	const SVPORT = 3001; // Este es el puerto en el que se va a iniciar el servidor
	const SVIP = 'localhost' // Y esta es la dirección en la que va a estar el servidor
	
	return {
		SVPORT,
		SVIP
	}
}

const localConfig = {
	connectionServer,
	connectionDatabase
}

export default localConfig;
```
5. Por último, volviendo a la terminal, regrese a la raíz del proyecto (siendo este ./proyecto-de-residencias/) e inicie el servidor usando el siguiente comando
```bash
npm start
```
6. Y también inicie la webapp moviéndose al directorio ./client/ y ejecutando el siguiente comando
```bash
npm run dev
```
> La página se iniciará en el siguiente puerto http://localhost:3000/