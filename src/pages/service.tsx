import { useRouter } from 'next/router';
import { MdWorkspacesFilled } from 'react-icons/md';
import { getServerSideProps } from 'src/utils/SessionAuthenticator';

import * as GetDBData from 'src/hooks/GetDBData';
import * as StringUtilities from 'src/utils/StringUtilities';

import classNames from 'classnames';

import { Head, Header, Footer, Button } from 'src/components/shared';

import styles from 'src/styles/service.module.css';

interface ServiceProps {
	session: boolean;
	sessionAuth: string;
}

export default function Service(props: ServiceProps) {
	const { session, sessionAuth } = props;
	const router = useRouter();
	const selectedService = router.query.service ? router.query.service.toString() : '';

	const name =
		selectedService === 'cfe'
			? selectedService.toUpperCase()
			: StringUtilities.wordsToCapitalLetter({ text: selectedService });

	return (
		<>
			<Head title={selectedService} />

			<Header session={session} sessionAuth={sessionAuth} />

			<section className={styles.service}>
				<article className={styles.iconTitle}>
					<MdWorkspacesFilled className={styles.icon} />
					<h2>{name}</h2>
				</article>
				<Button icon={'add'} />
			</section>

			<section className={styles.renderProducts}></section>

			<Footer />
		</>
	);
}

export { getServerSideProps };
