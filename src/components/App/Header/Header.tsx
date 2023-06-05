import { useState, useEffect } from 'react';
import { MdDashboard, MdShoppingCart, MdOutlineMenu } from 'react-icons/md';

import { useWindowDimensions } from 'src/utils/WindowUtilities';
import { GetCurrentUserCart, GetCurrentUserData } from 'src/hooks/GetDBData';
import { wordsToAcronym, wordsToCapitalLetter, firstWord } from 'root/src/utils/StringUtilities';

import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames';

import Auth from '../Auth/Auth';
import Cart from '../Cart/Cart';
import Menu from '../Menu/Menu';

import styles from './styles/Header.module.css';

interface HeaderProps {
	session: boolean;
	sessionAuth: string;
}

export default function Header(props: HeaderProps) {
	const { session, sessionAuth } = props;
	const { width } = useWindowDimensions();
	const userCart = GetCurrentUserCart({ sessionAuth });
	const userData = GetCurrentUserData({ sessionAuth });

	const [windowWidth, setWindowWidth] = useState<number>(0);
	const [cartStatus, setCartStatus] = useState<boolean>(false);
	const [authStatus, setAuthStatus] = useState<boolean>(false);
	const [menuStatus, setMenuStatus] = useState<boolean>(false);

	useEffect(() => {
		setWindowWidth(width);
	}, [width]);

	const changeCartStatus = () => {
		setCartStatus((status) => !status);
	};

	const changeAuthMenuStatus = () => {
		if (!session) {
			setAuthStatus((status) => !status);
		} else {
			setMenuStatus((status) => !status);
		}
	};

	return (
		<>
			<header className={styles.header}>
				<nav className={styles.container}>
					<h2>{'ProtoApp'}</h2>
					<div className={styles.buttons}>
						<Link className={styles.mdDashBoard} href={{ pathname: '../../' }}>
							<MdDashboard className={styles.icon} />
							<h5>{'Home'}</h5>
						</Link>
						{session && (
							<button onClick={changeCartStatus} className={styles.mdShoppingCart}>
								<MdShoppingCart className={styles.icon} />
								<h5>{'Mi carrito'}</h5>
								{userCart.length > 0 && <h5 className={styles.quantity}>{userCart.length}</h5>}
							</button>
						)}
						<button
							onClick={changeAuthMenuStatus}
							className={classNames(styles.mdOutlineMenu, windowWidth > 1366 && session && styles.session)}
						>
							{windowWidth > 1366 ? (
								<>
									{session ? (
										<>
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
										</>
									) : (
										<>
											<h4>{'MI CUENTA'}</h4>
											<h5>{'Entrar'}</h5>
										</>
									)}
								</>
							) : (
								<>
									<MdOutlineMenu className={styles.icon} />
									<h5 className={styles.labelButton}>{'Menu'}</h5>
								</>
							)}
						</button>
					</div>
				</nav>
			</header>
			{authStatus && <Auth closeAuth={changeAuthMenuStatus} />}
			{cartStatus && <Cart sessionAuth={sessionAuth} closeCartMenu={changeCartStatus} />}
			{menuStatus && <Menu sessionAuth={sessionAuth} closeMenu={changeAuthMenuStatus} />}
		</>
	);
}
