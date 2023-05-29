import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { MdWorkspacesFilled } from 'react-icons/md';
import { getServerSideProps } from 'src/utils/SessionAuthenticator';

import * as GetDBData from 'src/hooks/GetDBData';
import * as StringUtilities from 'src/utils/StringUtilities';

import classNames from 'classnames';

import { Head, Header, Footer, Button } from 'src/components/shared';
import { AddContract } from 'src/components/Service';

import styles from 'src/styles/service.module.css';

interface ServiceProps {
	session: boolean;
	sessionAuth: string;
}

export default function Service(props: ServiceProps) {
	const { session, sessionAuth } = props;
	const router = useRouter();
	const selectedService = router.query.service ? router.query.service.toString() : '';
	const [addContractStatus, setAddConctractStatus] = useState<boolean>(false);

	const name =
		selectedService === 'cfe'
			? selectedService.toUpperCase()
			: StringUtilities.wordsToCapitalLetter({ text: selectedService });

	const handleAddContractStatusChange = () => {
		setAddConctractStatus((status) => !status);
	};

	return (
		<>
			<Head title={selectedService} />

			<Header session={session} sessionAuth={sessionAuth} />

			<section className={styles.service}>
				<article className={styles.iconTitle}>
					<MdWorkspacesFilled className={styles.icon} />
					<h2>{name}</h2>
				</article>
				<Button icon={'add'} onClick={handleAddContractStatusChange} />
			</section>

			<section className={styles.renderProducts}></section>

			{addContractStatus && <AddContract handleCloseCartel={handleAddContractStatusChange} />}

			<Footer />
		</>
	);
}

export { getServerSideProps };
