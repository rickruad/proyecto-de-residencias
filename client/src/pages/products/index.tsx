import { useRouter } from 'next/router';
import { MdShoppingBag } from 'react-icons/md';

import * as Server from '@/hooks/Server';
import * as AuxiliarFunctions from '@/hooks/AuxiliarFunctions';

import classNames from 'classnames';

import Head from '@/components/Head';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer';
import Product from '@/components/Products/Product';
import AddProducts from '@/components/Products/AddProducts';

import styles from '@/styles/products.module.css';

export default function Products() {
  Server.LoginAuthenticator();

  const { admin } = Server.GetCurrentUserInformation();
  const { ids, products, datesAdded, images, descriptions, prices, categories, types } = Server.GetAllProducts();

  const router = useRouter();
  const selectedCategory = router.query.category !== undefined ? router.query.category : 'NULL';

  if (!Array.isArray(products)) {
    return <>
      <Head title='Productos' />

      <Header />

      <section className={styles.category}>
        <MdShoppingBag className={styles.icon} />
        <h2>{AuxiliarFunctions.wordsToCapitalLetter({ text: selectedCategory.toString() })}</h2>
      </section>

      <section className={classNames(styles.products, styles.noProducts)}>
        <h2>{'No hay productos disponibles'}</h2>
        {
          admin === 1 ?
            <AddProducts />
            :
            null
        }
      </section>

      <Footer />
    </>
  }

  const filterProducts = products.map((product, index) => {
    return {
      id: ids[index],
      product: product,
      dateAdded: datesAdded[index],
      image: images[index],
      description: descriptions[index],
      price: prices[index].split(', '),
      category: categories[index],
      type: types[index]
    }
  }).filter((product, index, self) => {
    return index === self.findIndex((a) => {
      return a.dateAdded === product.dateAdded && a.category === selectedCategory;
    });
  });

  if (filterProducts.length <= 0) {
    return <>
      <Head title='Productos' />

      <Header />

      <section className={styles.category}>
        <MdShoppingBag className={styles.icon} />
        <h2>{AuxiliarFunctions.wordsToCapitalLetter({ text: selectedCategory.toString() })}</h2>
      </section>

      <section className={classNames(styles.products, styles.noProducts)}>
        <h2>{'No hay productos disponibles'}</h2>
        {
          admin === 1 ?
            <AddProducts />
            :
            null
        }
      </section>

      <Footer />
    </>
  }

  const allSelectedProducts = filterProducts.map((selectedProduct) => {
    return <Product
      key={selectedProduct.id}
      id={selectedProduct.id}
      product={selectedProduct.product}
      image={selectedProduct.image}
      description={selectedProduct.description}
      price={selectedProduct.price}
      category={selectedProduct.category}
      type={selectedProduct.type}
      currentCategory={selectedCategory.toString()}
    />
  })

  return <>
    <Head title={AuxiliarFunctions.wordsToCapitalLetter({ text: selectedCategory.toString() })} />

    <Header />

    <section className={styles.category}>
      <MdShoppingBag className={styles.icon} />
      <h2>{AuxiliarFunctions.wordsToCapitalLetter({ text: selectedCategory.toString() })}</h2>
      {
        admin === 1 ?
          <AddProducts />
          :
          null
      }
    </section>

    <section className={styles.products}>{allSelectedProducts}</section>

    <Footer />
  </>
}