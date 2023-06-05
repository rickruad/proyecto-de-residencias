import { useRouter } from 'next/router';
import { useState, FormEvent, ChangeEvent } from 'react';

import { Button } from 'src/components/shared';

import styles from './styles/Auth.SignIn.module.css';

export default function AuthSignIn() {
	const router = useRouter();

	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [errorMessageStatus, setErrorMessageStatus] = useState<boolean>(false);

	const [errorMessage, setErrorMessage] = useState<string>('');

	const [emailValue, setEmailValue] = useState<string>('');
	const [passwordValue, setPasswordValue] = useState<string>('');

	const handleShowPassword = () => {
		setShowPassword((status) => !status);
	};

	const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
		setEmailValue(event.target.value);
	};

	const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
		setPasswordValue(event.target.value);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData();

		formData.append('email', emailValue);
		formData.append('password', passwordValue);

		try {
			const response = await fetch('/api/auth/sign-in', {
				method: 'POST',
				body: formData,
			});

			if (response.ok) {
				router.reload();
				return;
			}

			setErrorMessage('Credenciales inválidas');
			setErrorMessageStatus((status) => !status);
		} catch (err) {
			setErrorMessage(`${err}`);
			setErrorMessageStatus((status) => !status);
		}
	};

	return (
		<form onSubmit={handleSubmit} className={styles.container}>
			<h2>{'Iniciar sesión'}</h2>
			<div className={styles.inputs}>
				{errorMessageStatus && (
					<div className={styles.errorMessage}>
						<h3>{errorMessage}</h3>
					</div>
				)}
				<div className={styles.labelInput}>
					<label>{'Correo electrónico'}</label>
					<input type="email" value={emailValue} required={true} onChange={handleEmailChange} />
				</div>
				<div className={styles.labelInput}>
					<div className={styles.labelPassword}>
						<label>{'Contraseña - '}</label>
						<label className={styles.showPassword} onClick={handleShowPassword}>
							{showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
						</label>
					</div>
					<input
						type={showPassword ? 'text' : 'password'}
						value={passwordValue}
						required={true}
						onChange={handlePasswordChange}
					/>
				</div>
			</div>
			<Button type="submit" label="Iniciar Sesión" />
		</form>
	);
}
