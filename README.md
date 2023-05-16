# Proyecto de residencias

Este es un proyecto realizado en React con NextJS y TypeScript

## Requisitos

- Tener instalado MySQL Workbench con MySQL Server.
  > En la instalación de MySQL Workbench, al momento de llegar a la configuración del MySQL Server, en el apartado de métodos de autenticación, seleccione la opción "Use Legacy Authentication Method", puesto que el módulo MySQL para React no soporta aún el nuevo método de autenticación.
- Tener instalado Node.js
- Tener instalado Visual Studio Code o algún otro editor de código.

## Cómo ejecutar este proyecto

1. En MySQL Workbench, desactive la opción "Safe Updates" en Edit > Preferences > SQL Editor.
2. Ahora descargue el proyecto en [releases](https://github.com/rickruad/proyecto-de-residencias/releases), descomprimaló y abra la carpeta con Visual Studio Code.
3. Cree un archivo en la raíz del proyecto llamado "local.config.js" y copie el siguiente código modificando lo que está comentado.

```js
// local.config.js

function connectionDatabase() {
	const DBPASSWORD = 'password'; // Acá va la contraseña de su local instance.
	const DBPORT = 3306; // Acá va el puerto que utiliza MySQL Server, actualmente está puesto el número por default, si no lo modificó, dejeló así.
	
	return {
		DBPASSWORD,
		DBPORT
	}
}

function sessionAuthSecurity() {
	const amountHashSalt = 10; // Acá va la cantidad de salt que quiera que tenga el hash de las contraseñas y del sessionAuth. El número por defecto es el recomendado.
	const sessionAuthMultiplier = 30; // Este es el multiplicador del numero generado para el sessionAuth. El número por defecto es el recomendado.

	return {
		amountHashSalt,
		sessionAuthMultiplier,
	};
}

module.exports = { connectionDatabase, sessionAuthSecurity };
```

4. Luego, ejecute el script que va a crear todo lo necesario para funcionar con el siguiente comando

```bash
npm run setup
```

5. Ahora inicie la página con el siguiente comando

```bash
npm run dev
```

> La página se iniciará en el siguiente puerto http://localhost:3000/
