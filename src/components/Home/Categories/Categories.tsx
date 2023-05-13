import { useState, useEffect } from 'react';
import { StyledImage } from '@/hooks/StyledComponents';
import { MdShoppingBag, MdOutlineAddCircle } from 'react-icons/md';

import * as Server from '@/hooks/Server';
import * as AuxiliarFunctions from '@/hooks/AuxiliarFunctions';

import Link from 'next/link';
import classNames from 'classnames';

import styles from './styles/styles.module.css';

export default function Categories() {
  const { status, admin } = Server.GetCurrentUserInformation();

  const [categoriesEN, setCategoriesEN] = useState<string[]>([]);
  const [categoriesES, setCategoriesES] = useState<string[]>([]);

  useEffect(() => {
    const categoriesEN = ['cinemex', 'cinepolis', 'entertainment', 'food', 'games'];
    const categoriesES = ['cinemex', 'cinepolis', 'entretenimiento', 'comida', 'juegos'];

    setCategoriesEN(categoriesEN);
    setCategoriesES(categoriesES);
  }, [])

  const categories = categoriesEN.map((category, index) => {
    return {
      id: index,
      categoryEN: category,
      categoryES: categoriesES[index],
      image: `/img/categories/${category}.png`
    }
  })

  const allCategories = categories.map((currentCategory) => {
    const category = currentCategory.categoryEN;
    return (
      <Link key={currentCategory.id} href={{ pathname: `${status !== 1 ? './' : '../products'}`, query: { category } }} className={styles.category}>
        <StyledImage src={currentCategory.image} className={styles.image} />
        <h3 className={styles.title}>{AuxiliarFunctions.wordsToCapitalLetter({ text: currentCategory.categoryES })}</h3>
      </Link>
    )
  })

  return <>
    <section className={styles.categoriesSection}>
      <div className={styles.categoriesContainer}>
        <div className={styles.titleSection}>
          <MdShoppingBag className={styles.icon} />
          <h2>{'Productos'}</h2>
          <div className={styles.line} />
          {/* {
            admin === 1 ?
              <MdOutlineAddCircle className={classNames(styles.icon, styles.pointer)} />
              :
              null
          } */}
        </div>
        <h3>{'Busca entre las siguientes categorías y sorpréndete'}</h3>
        <div className={styles.allCategories}>{allCategories}</div>
      </div>
    </section>
  </>
}