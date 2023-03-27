# Proyecto de residencias
Este es un proyecto realizado en React con NextJS y TypeScript
## Requisitos
- Tener instalado git.
- Tener instalado MySQL Workbench con MySQL Server.
- Tener instalado Visual Studio Code o algún otro editor de código.
## Cómo ejecutar este proyecto
> Aclaración, antes de realizar todos estos pasos, deberá crear un schema en MySQL Workbench y dentro del schema crear una tabla llamada "users". Recomiendo nombrar al schema como "proyecto-de-residencias".
1. Primero, ubique el directorio al cual desee clonar el repositorio
2. Luego, abra la terminal y clone el proyecto con
```bash
$ git clone https://github.com/rickruad/proyecto-de-residencias
```
3. Abra el directorio en donde está clonado el proyecto
```bash
$ cd ./proyecto-de-residencias/
```
4. En este directorio vamos a instalar los módulos del servidor, ejecute el siguiente comando
```bash
$ npm install
```
5. Luego, diríjase al directorio "client"
```bash
$ cd ./client/
```
6. Ahora vamos a instalar los módulos del cliente con el mismo comando
```bash
$ npm install
```
7. En MySQL Workbench, modifique la tabla "users" creada previamente y añada las siguientes columnas

| Column Name | Datatype    | PK  | NN  | UQ  | B   | UN  | ZF  | AI  | G   | Default/Expression |
| ----------- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- | ------------------ |
| id          | INT         | Yes | Yes | No  | No  | No  | No  | No  | No  | Empty              |
| email       | VARCHAR(45) | No  | Yes | Yes | No  | No  | No  | No  | No  | Empty              |
| password    | VARCHAR(45) | No  | Yes | No  | No  | No  | No  | No  | No  | Empty              |
| username    | VARCHAR(45) | No  | Yes | Yes | No  | No  | No  | No  | No  | Empty              |
| birthdate   | VARCHAR(45) | No  | Yes | No  | No  | No  | No  | No  | No  | Empty              |
| status      | VARCHAR(45) | No  | Yes | No  | No  | No  | No  | No  | No  | '0'                |
| admin       | VARCHAR(45) | No  | Yes | No  | No  | No  | No  | No  | No  | '0'                | 

> Para ver la tabla, seleccione el schema creado (según lo recomendado, debería llamarse proyecto-de-residencias), cree un nuevo SQL File y escriba "SELECT * FROM users", luego le da al botón "Execute the statement under the keyboard cursor" y con eso debería de mostrarse la tabla

8. Ahora abra con Visual Studio Code el proyecto y diríjase al archivo index.js ubicado en ./proyecto-de-residencias/server/index.js
9. Dentro del archivo, revise las siguientes líneas
```js
const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '12345asd',
  database: 'proyecto-de-residencias',
  PORT: 3306
})
```
10. Reemplace la password con su password de su base de datos, al igual que el nombre de la database con el nombre del schema creado anteriormente (si uso el nombre recomendado, no hace falta cambiarlo).
> El PORT no es necesario cambiarlo a no ser que usted haya cambiado el puerto en donde se ejecuta MySQL Server, si ese fue el caso, reemplace el número del PORT por el que ingresó usted al momento de configurar el MySQL Server.
11. Por último, volviendo a la terminal, regrese a la raíz del proyecto (siendo este ./proyecto-de-residencias/) e inicie el servidor usando el siguiente comando
```bash
npm start
```
12. Y también inicie la webapp moviéndose al directorio ./client/ y ejecutando el siguiente comando
```bash
npm run dev
```
> El servidor se ejecutará en http://localhost:3001/ y la webapp en http://localhost:3000/