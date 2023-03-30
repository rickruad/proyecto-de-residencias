import Head from '@/components/Head';
import Header from '@/components/Header';

import styles from '@/styles/categories.module.css';

export default function Home() {
  const goToCinemex = () => {
    if (typeof window !== 'undefined') {
      window.location.href = './categories/cinemex/';
    }
  }

  const goToCinepolis = () => {
    if (typeof window !== 'undefined') {
      window.location.href = './categories/cinepolis/';
    }
  }

  const goToEntertainment = () => {
    if (typeof window !== 'undefined') {
      window.location.href = './categories/entertainment/';
    }
  }

  const goToFood = () => {
    if (typeof window !== 'undefined') {
      window.location.href = './categories/food/';
    }
  }

  const goToGames = () => {
    if (typeof window !== 'undefined') {
      window.location.href = './categories/games/';
    }
  }

  return <>
    <Head title='Categorías' />

    <Header />

    <section className={styles.categories}>
      <div onClick={goToCinemex} className={styles.category}>
        <div className={styles.image1}></div>
        <h3 className={styles.title}>Cinemex</h3>
      </div>
      <div onClick={goToCinepolis} className={styles.category}>
        <div className={styles.image2}></div>
        <h3 className={styles.title}>Cinepolis</h3>
      </div>
      <div onClick={goToEntertainment} className={styles.category}>
        <div className={styles.image3}></div>
        <h3 className={styles.title}>Entretenimiento</h3>
      </div>
      <div onClick={goToFood} className={styles.category}>
        <div className={styles.image4}></div>
        <h3 className={styles.title}>Cómida</h3>
      </div>
      <div onClick={goToGames} className={styles.category}>
        <div className={styles.image5}></div>
        <h3 className={styles.title}>Juegos</h3>
      </div>
    </section>
  </>
}