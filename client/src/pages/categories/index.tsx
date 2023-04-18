import { useEffect, useState } from 'react';

import Server from '@/hooks/Server';
import AuxiliarFunctions from '@/hooks/AuxiliarFunctions';

import Head from '@/components/Head';
import Header from '@/components/Header';

import Link from 'next/link';
import styled from 'styled-components';

import styles from '@/styles/categories.module.css';

const Background = styled.div<{ image: string }>`
  background-image: url(/img/${props => props.image}.png);
`;

export default function Home() {
  Server.useLoginAuthenticationInsidePage();

  const [categoriesEN, setCategoriesEN] = useState<string[]>([]);
  const [categoriesES, setCategoriesES] = useState<string[]>([]);

  useEffect(() => {
    const categoriesEN = ['cinemex', 'cinepolis', 'entertainment', 'food', 'games'];
    const categoriesES = ['cinemex', 'cinepolis', 'entretenimiento', 'comida', 'juegos'];

    setCategoriesEN(categoriesEN);
    setCategoriesES(categoriesES);
  }, [])

  const categoriesToMap = categoriesEN.map((category, index) => {
    return {
      categoryEN: category,
      categoryES: categoriesES[index],
      image: category
    }
  })

  const allCategories = categoriesToMap.map((currentCategory) => {
    const category = currentCategory.categoryEN;
    return (
      <Link key={currentCategory.categoryEN} href={{ pathname: '../categories/products', query: { category } }} className={styles.category}>
        <Background image={currentCategory.image} className={styles.image} />
        <h3 className={styles.title}>{AuxiliarFunctions.ToCapitalLetter({ username: currentCategory.categoryES })}</h3>
      </Link>
    )
  })

  return <>
    <Head title='Categorías' />

    <Header />

    <section className={styles.categories}>{allCategories}</section>
  </>
}