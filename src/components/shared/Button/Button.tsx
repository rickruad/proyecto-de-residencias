import { MdOutlineAdd } from 'react-icons/md';

import styles from './styles/button.module.css';

type ButtonProps = { type?: 'button' | 'submit' | 'reset'; onClick?: () => void } & (
	| { label: string; icon?: 'add' }
	| { icon: 'add'; label?: string }
);

/**
 * Button component.
 * @param props this contains label, icon, type and onClick.
 */
export default function Button(props: ButtonProps) {
	const { label, icon, type, onClick } = props;

	if (label && icon) {
		switch (icon) {
			case 'add':
				return (
					<button type={type} onClick={onClick} className={styles.button}>
						<MdOutlineAdd className={styles.icon} />
						{label}
					</button>
				);
		}
	}

	if (label) {
		return (
			<button type={type} onClick={onClick} className={styles.button}>
				{label}
			</button>
		);
	}

	switch (icon) {
		case 'add':
			return <MdOutlineAdd type={type} onClick={onClick} className={styles.iconButton} />;
	}

	return <></>;
}
