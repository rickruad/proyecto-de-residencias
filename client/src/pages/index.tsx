import { useState, useEffect } from 'react';

import Link from 'next/link';
import Image from 'next/image'
import classNames from 'classnames';
import styled from 'styled-components';

import Server from '@/hooks/Server';
import WindowDimensions from '@/hooks/WindowDimensions'

import Head from '@/components/Head';
import Header from '@/components/Header'

import styles from '@/styles/home.module.css';

const ServerStatusSection = styled.section<{ display: string }>`
  display: ${props => props.display};
  flex-direction: column;
  align-items: center;
`

const CarouselContainer = styled.div<{ position: number }>`
  transform: translateX(${props => props.position}%);
`;

export default function Home() {
  const serverStatus = Server.useIsOnline();
  const [displayStatus, setDisplayStatus] = useState('');

  const [position, setPosition] = useState(0);
  const [lessLength, setLessLength] = useState(0);
  const [newPosition, setNewPosition] = useState(0);
  const windowWidth = WindowDimensions.useWindowWidth();
  const images = ['cinepolis.jpg', 'cinemex.jpg', 'cfe-internet.jpg', 'omnibus-mexico.png'];

  const cardsHTML = [];

  Server.useLoginAuthenticationInsidePage();

  useEffect(() => {
    setDisplayStatus(serverStatus ? 'none' : 'flex');
  }, [serverStatus]);

  useEffect(() => {
    setLessLength(windowWidth >= 1280 ? 1 : 0)
    const interval = setInterval(() => {
      let currentPositionRight = (position + 1) % (images.length - lessLength);

      setPosition(currentPositionRight);
      setNewPosition(currentPositionRight * -(100 / images.length));
    }, 5000);

    return () => clearInterval(interval);

  }, [position, lessLength, windowWidth, images.length]);

  for (let i = 0; i < images.length; i++) {
    cardsHTML.push(
      <div className={styles.card} key={i}>
        <Image
          className={styles.image}
          src={`/img/${images[i]}`}
          alt={'image'}
          width={1300}
          height={400}
          blurDataURL='data:...'
          placeholder='blur'
        />
      </div>
    )
  }

  return <>
    <Head title='Proyecto de Residencias' />

    <Header />

    <ServerStatusSection display={displayStatus} className={styles.serverStatusStyles}>
      <h2>{serverStatus ? serverStatus : 'El servidor no está en linea'}</h2>
    </ServerStatusSection>

    <section className={styles.carouselSection}>
      <div>
        <CarouselContainer position={newPosition} className={styles.carouselContainer}>{cardsHTML}</CarouselContainer>
      </div>
    </section>

    <section className={styles.webSections}>
      <div>
        <h3>Productos</h3>
        <Link href='../categories/' className={classNames(styles.card, styles.products)}></Link>
      </div>
      <div>
        <h3>Servicios</h3>
        <Link href='#' className={classNames(styles.card, styles.services)}></Link>
      </div>
    </section>
  </>
}