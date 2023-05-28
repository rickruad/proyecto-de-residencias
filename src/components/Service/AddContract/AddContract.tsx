import { useRouter } from 'next/router';

import Image from 'next/image';

import styles from './styles/addcontract.module.css';

export default function AddContract() {
	return (
		<>
			<div />
			<section>
				<form className={styles.addProductCartel}>
					<h2>{'Añade un producto'}</h2>
					<Image
						className={styles.styledImage}
						src={'/img/placeholder-1200x600.png'}
						alt={'Vista previa'}
						width={1000}
						height={1000}
						priority={true}
					/>
					<div className={styles.labelInputFile}>
						<label>{'Añade una imágen a la publicación'}</label>
						<h5>{'Preferentemente 1200x600'}</h5>
						<input type="file" accept=".png,.jpeg,.jpg,.gif" required={true} />
					</div>
					<div className={styles.labelInput}>
						<label>{'Escriba el nombre de la publicación'}</label>
						<input type="text" required={true} />
					</div>
					<div className={styles.labelInput}>
						<label>{'Escriba la descripción de la publicación'}</label>
						<input type="text" required={true} />
					</div>
					<div className={styles.labelInput}>
						<label>{'Cashback'}</label>
						<div className={styles.cashback}>
							<input type="number" max="100" required={true} />
							<h3>{'%'}</h3>
						</div>
					</div>
					<div className={styles.buttons}>
						<button type="submit">{'Guardar'}</button>
						<button type="button">{'Cancelar'}</button>
					</div>
				</form>
			</section>
		</>
	);
}
