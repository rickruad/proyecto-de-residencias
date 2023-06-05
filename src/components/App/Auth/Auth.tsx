import { useState } from 'react';
import { MdClose } from 'react-icons/md';

import Image from 'next/image';

import AuthSignIn from './Auth.SignIn';
import AuthSignUp from './Auth.SignUp';

import styles from './styles/Auth.module.css';

interface AuthProps {
	closeAuth: () => void;
}

export default function Auth({ closeAuth }: AuthProps) {
	const [authStatus, setAuthStatus] = useState<boolean>(false);

	const changeAuthStatus = () => {
		setAuthStatus((status) => !status);
	};

	return (
		<>
			<section className={styles.auth}>
				<div className={styles.background} />
				<article className={styles.cartel}>
					<MdClose className={styles.mdClose} onClick={closeAuth} />
					<div className={styles.welcome}>
						<Image
							className={styles.image}
							src="/img/login-background.jpg"
							alt="image"
							width={500}
							height={500}
							priority
						/>
						<div className={styles.filter} />
						<h1>{'Bienvenido'}</h1>
						<div className={styles.button}>
							<h3>{!authStatus ? '¿Eres nuevo en esta página?' : '¿Ya tienes una cuenta?'}</h3>
							<button onClick={changeAuthStatus}>{!authStatus ? 'Regístrate aquí' : 'Inicia sesión aquí'}</button>
						</div>
					</div>
					{!authStatus ? <AuthSignIn /> : <AuthSignUp closeSignUp={changeAuthStatus} />}
				</article>
			</section>
		</>
	);
}
