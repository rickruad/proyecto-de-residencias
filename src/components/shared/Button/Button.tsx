import { MdOutlineAdd } from 'react-icons/md';
import classNames from 'classnames';
import styles from './styles/button.module.css';

type ButtonProps =
	| {
			label: string;
			icon?: never;
			onClick?: () => void;
			className?: string;
	  }
	| {
			icon: 'add';
			label?: never;
			onClick?: () => void;
			className?: string;
	  };

export default function Button(props: ButtonProps) {
	const { label, icon, onClick, className } = props;

	return <>
	</>;
}
