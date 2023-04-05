import { useEffect, useState } from 'react';

import Server from '@/hooks/Server';
import AuxiliarFunctions from '@/hooks/AuxiliarFunctions';

import Head from '@/components/Head';
import Header from '@/components/Header';

import Link from 'next/link';
import styled from 'styled-components';

import styles from '@/styles/categories.module.css';

const Background = styled.div<{ image: string }>`
  background-image: url(${props => props.image});
`;

export default function Home() {
  const [categoriesInHTML, setCategoriesInHTML] = useState<JSX.Element[]>([<></>]);

  Server.useLoginAuthenticationInsidePage();

  useEffect(() => {
    const categoriesHTML = [...categoriesInHTML];
    const categories = ['cinemex', 'cinepolis', 'entertainment', 'food', 'games'];
    const categoriesInSpanish = ['cinemex', 'cinepolis', 'entretenimiento', 'comida', 'juegos'];
    
    for (let i = 0; i < categories.length; i++) {
      var image = `/img/${categories[i]}.png`;
      var category = categories[i];
      var categoryInSpanish = categoriesInSpanish[i];
      categoriesHTML.push(
        <Link key={i} href={{ pathname: '../categories/products', query: { category } }} className={styles.category}>
          <Background image={image} className={styles.image}></Background>
          <h3 className={styles.title}>{AuxiliarFunctions.ToCapitalLetter({ username: categoryInSpanish })}</h3>
        </Link>
      )
    }

    setCategoriesInHTML(categoriesHTML);
  }, [])

  return <>
    <Head title='Categorías' />

    <Header />

    <section className={styles.categories}>{categoriesInHTML}</section>
  </>
}