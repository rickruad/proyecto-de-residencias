import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { MdPowerSettingsNew, MdInfoOutline, MdOutlineListAlt, MdClose } from 'react-icons/md';

import { GetCurrentUserData } from 'src/hooks/GetDBData';
import { useWindowDimensions } from 'src/utils/WindowUtilities';
import { wordsToCapitalLetter, wordsToAcronym, firstWord } from 'src/utils/StringUtilities';

import Link from 'next/link';
import Image from 'next/image';

import styles from './styles/Menu.module.css';

interface MenuProps {
	sessionAuth: string;
	closeMenu: () => void;
}

export default function Menu(props: MenuProps) {
	const { sessionAuth, closeMenu } = props;
	const { width } = useWindowDimensions();

	const router = useRouter();
	const userData = GetCurrentUserData({ sessionAuth });

	const [windowWidth, setWindowWidth] = useState<number>(0);

	useEffect(() => {
		setWindowWidth(width);
	}, [width]);

	const signOut = async () => {
		const response = await fetch('/api/auth/sign-out');

		if (response.ok) {
			router.reload();
		}
	};

	return (
		<>
			<div className={styles.background} />
			<section className={styles.menu}>
				<article className={styles.cartel}>
					<MdClose onClick={closeMenu} className={styles.mdClose} />
					{windowWidth <= 1366 && (
						<>
							<div className={styles.profile}>
								{userData?.picture ? (
									<Image
										className={styles.image}
										src={userData.picture}
										alt={`${userData.name} profile picture`}
										width={200}
										height={200}
										priority={true}
									/>
								) : (
									<h4 className={styles.noImage}>{wordsToAcronym({ text: userData ? userData.name : '' })}</h4>
								)}
								<div className={styles.info}>
									<h4>{'¡Hola!'}</h4>
									<h5>
										{wordsToCapitalLetter({
											text: firstWord({ text: userData ? userData.name : '' }),
										})}
									</h5>
								</div>
							</div>
						</>
					)}
					<Link className={styles.button} href={{ pathname: './account/' }}>
						<MdInfoOutline className={styles.icon} />
						<h4 className={styles.text}>{'Información'}</h4>
					</Link>
					<Link className={styles.button} href={{ pathname: './purchase-history/' }}>
						<MdOutlineListAlt className={styles.icon} />
						<h4 className={styles.text}>{'Mis compras'}</h4>
					</Link>
					<button onClick={signOut} className={styles.button}>
						<MdPowerSettingsNew className={styles.icon} />
						<h4 className={styles.text}>{'Cerrar Sesión'}</h4>
					</button>
				</article>
			</section>
		</>
	);
}
