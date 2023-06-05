import { useState, useEffect, FormEvent, ChangeEvent } from 'react';

import Image from 'next/image';

import { Button } from 'src/components/shared';

import styles from './styles/Auth.SignUp.module.css';

interface AuthSignUpProps {
	closeSignUp: () => void;
}

export default function AuthSignUp({ closeSignUp }: AuthSignUpProps) {
	const [currentYear, setCurrentYear] = useState<number>(0);
	const [currentMonth, setCurrentMonth] = useState<number>(0);
	const [currentDay, setCurrentDay] = useState<number>(0);

	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [doneMessageStatus, setDoneMessageStatus] = useState<boolean>(false);
	const [errorMessageStatus, setErrorMessageStatus] = useState<boolean>(false);

	const [errorMessage, setErrorMessage] = useState<string>('');

	const [usernameValue, setUsernameValue] = useState<string>('');
	const [birthdateValue, setBirthdateValue] = useState<string>('');
	const [emailValue, setEmailValue] = useState<string>('');
	const [passwordValue, setPasswordValue] = useState<string>('');
	const [userPictureValue, setUserPictureValue] = useState<File | null>(null);
	const [userPicturePreview, setUserPicturePreview] = useState<string>('');

	useEffect(() => {
		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();

		setCurrentYear(year);
		setCurrentMonth(month);
		setCurrentDay(day);
	}, []);

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
		setUsernameValue(event.target.value);
	};

	const handleBirthdateChange = (event: ChangeEvent<HTMLInputElement>) => {
		setBirthdateValue(event.target.value);
	};

	const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
		setEmailValue(event.target.value);
	};

	const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
		setPasswordValue(event.target.value);
	};

	const handleUserPictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setUserPictureValue(event.target.files[0]);
			const file = event.target.files[0];
			const reader = new FileReader();

			reader.onloadend = () => {
				setUserPicturePreview(reader.result as string);
			};

			reader.readAsDataURL(file);
		} else {
			setUserPictureValue(null);
			setUserPicturePreview('');
		}
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData();

		if (userPictureValue) {
			formData.append('profilePicture', userPictureValue);
		}

		formData.append('username', usernameValue);
		formData.append('birthdate', birthdateValue);
		formData.append('email', emailValue);
		formData.append('password', passwordValue);

		try {
			const response = await fetch('/api/auth/sign-up', {
				method: 'POST',
				body: formData,
			});

			if (response.ok) {
				setErrorMessageStatus(false);
				setDoneMessageStatus((status) => !status);

				setTimeout(() => {
					closeSignUp();
				}, 1000);
				return;
			}

			setErrorMessageStatus((status) => !status);
			setErrorMessage('Correo electrónico ya existente');
		} catch (err) {
			throw err;
		}
	};

	return (
		<form onSubmit={handleSubmit} className={styles.container}>
			<h2>{'Registro nuevo'}</h2>
			<div className={styles.inputs}>
				{doneMessageStatus && (
					<div className={styles.doneMessage}>
						<h3>{'Registro con éxito'}</h3>
					</div>
				)}
				{errorMessageStatus && (
					<div className={styles.errorMessage}>
						<h3>{errorMessage}</h3>
					</div>
				)}
				<div className={styles.labelInput}>
					<label>{'Nombre completo'}</label>
					<input
						type="text"
						required={true}
						minLength={1}
						maxLength={64}
						value={usernameValue}
						onChange={handleUsernameChange}
					/>
				</div>
				<div className={styles.labelInput}>
					<label>{'Fecha de nacimiento'}</label>
					<input
						type="date"
						min={`${currentYear - 100}-${currentMonth > 9 ? currentMonth : `0${currentMonth}`}-${
							currentDay > 9 ? currentDay : `0${currentDay}`
						}`}
						max={`${currentYear}-${currentMonth > 9 ? currentMonth : `0${currentMonth}`}-${
							currentDay > 9 ? currentDay : `0${currentDay}`
						}`}
						value={birthdateValue}
						required={true}
						onChange={handleBirthdateChange}
					/>
				</div>
				<div className={styles.labelInput}>
					<label>{'Correo electrónico'}</label>
					<input
						type="email"
						required={true}
						minLength={1}
						maxLength={64}
						value={emailValue}
						onChange={handleEmailChange}
					/>
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
						required={true}
						value={passwordValue}
						onChange={handlePasswordChange}
					/>
				</div>
				<div className={styles.uploadImage}>
					<Image
						className={styles.profilePicture}
						src={userPicturePreview ? userPicturePreview : '/img/placeholder-200x200.png'}
						alt={'Vista previa'}
						width={200}
						height={200}
						priority={true}
					/>
					<div className={styles.labelInput}>
						<label>{'Carga tu imagen de usuario'}</label>
						<h5>{'(Relación de aspecto 1:1)'}</h5>
						<input type="file" accept=".png,.jpeg,.jpg,.gif" onChange={handleUserPictureChange} />
					</div>
				</div>
			</div>
			<Button type="submit" label="Registrarse" />
		</form>
	);
}
