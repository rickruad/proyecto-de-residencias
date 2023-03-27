import ServerStatus from '@/hooks/ServerStatus';
import UserStatus from '@/hooks/UserStatus';

import styled from 'styled-components';

import { useState, useEffect } from 'react';

import Image from 'next/image'

import WindowDimensions from '@/hooks/WindowDimensions'

import Header from '@/components/Header'

import Head from '@/components/Head';

import styles from '@/styles/home.module.css';

const images = ['cinepolis.jpg', 'cinemex.jpg', 'cfe-internet.jpg', 'omnibus-mexico.png'];

const ServerStatusSection = styled.section<{ display: string }>`
  display: ${props => props.display};
`

const CardContainerMove = styled.div<{ position: number }>`
  transform: translateX(${props => props.position}%);
`;

export default function Home() {
  const serverStatus = ServerStatus.ItsOnline();
  const windowWidth = WindowDimensions.useWindowWidth();
  const webSectionHTML = [];
  const [position, setPosition] = useState(0);
  const [newPosition, setNewPosition] = useState(0);
  const [lessLength, setLessLength] = useState(0);
  const cardsHTML = [];

  UserStatus.InsidePage();

  for (let i = 0; i < 2; i++) {
    webSectionHTML.push(
      <div className={styles.card} key={i}></div>
    )
  }

  useEffect(() => {
    setLessLength(windowWidth >= 1280 ? 1 : 0)
    const interval = setInterval(() => {
      let currentPositionRight = (position + 1) % (images.length - lessLength);

      setPosition(currentPositionRight);
      setNewPosition(currentPositionRight * -(100 / images.length));
    }, 5000);

    return () => clearInterval(interval);

  }, [position, lessLength, windowWidth]);

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

    <ServerStatusSection display={serverStatus ? 'none' : 'flex'} className={styles.serverStatusStyles}>
      <h2>{serverStatus ? serverStatus : 'El servidor no está en linea'}</h2>
    </ServerStatusSection>

    <section className={styles.carouselSection}>
      <div>
        <CardContainerMove position={newPosition} className={styles.cardContainerStyle}>{cardsHTML}</CardContainerMove>
      </div>
    </section>

    <section className={styles.webSections}>{webSectionHTML}</section>
  </>
}