import { useRouter } from 'next/router';

import * as Server from '@/hooks/Server';

import Head from '@/components/Head';
import Header from '@/components/Header';
import Product from '@/components/Products/Product';
import AddNewProduct from '@/components/Products/AddNewProduct';

import styles from '@/styles/products.module.css';

export default function Products() {
  Server.useLoginAuthenticationInsidePage();

  const { admin } = Server.GetCurrentUserInformation();
  const { ids, products, images, descriptions, prices, categories, types } = Server.useAllProducts();

  const router = useRouter();
  const selectedCategory = router.query.category !== undefined ? router.query.category : 'NULL';

  if (!Array.isArray(products)) {
    return <>
      <Head title='Productos' />

      <Header />

      {admin === 1 ?
        <AddNewProduct category={selectedCategory.toString()} />
        :
        null
      }

    </>
  }

  const filterProducts = products.map((product, index) => {
    return {
      id: ids[index],
      product: product,
      image: images[index],
      description: descriptions[index],
      price: prices[index].split(', '),
      category: categories[index],
      type: types[index]
    }
  }).filter((product, index, self) => {
    return index === self.findIndex((a) => {
      return a.product === product.product && a.category === selectedCategory;
    });
  });

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
    <Head title='Productos' />

    <Header />

    <section className={styles.container}>{allSelectedProducts}</section>

    {admin === 1 ?
      <AddNewProduct category={selectedCategory.toString()} />
      :
      null
    }

  </>
}