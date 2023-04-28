import { useState, useEffect } from 'react';
import { StyledImage, StyledCarousel } from '@/hooks/StyledComponents';

import Link from 'next/link';

import styles from './styles/styles.module.css';

export default function Carousel() {
  const [arrayImages, setArrayImages] = useState<string[]>([]);
  const [position, setPosition] = useState<number>(0);
  const [newPosition, setNewPosition] = useState<number>(0);

  useEffect(() => {
    const images = ['cinepolis.jpg', 'cinemex.jpg', 'cfe-internet.jpg', 'omnibus-mexico.png'];

    setArrayImages(images);
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      let currentPositionRight = (position + 1) % arrayImages.length;

      setPosition(currentPositionRight);
      setNewPosition(currentPositionRight * -(348 / arrayImages.length));
    }, 5000);

    return () => clearInterval(interval);
  }, [position, arrayImages.length])

  const images = arrayImages.map((image, index) => {
    return {
      id: index,
      image: `/img/carousel/${image}`
    }
  })

  const allImagesForCarousel = images.map((currentImage) => {
    return (
      <Link key={currentImage.id} className={styles.link} href={{ pathname: '../../' }}>
        <StyledImage src={currentImage.image} className={styles.styledImage} />
      </Link>
    )
  })

  return <>
    <section className={styles.carouselContainer}>
      <div>
        <div>
          <StyledCarousel position={newPosition} className={styles.styledCarousel} >{allImagesForCarousel}</StyledCarousel>
        </div>
      </div>
    </section>
  </>
}