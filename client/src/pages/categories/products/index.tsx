import { useRouter } from 'next/router';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';

import Image from 'next/image';
import classNames from 'classnames';

import Server from '@/hooks/Server';

import Head from '@/components/Head';
import Header from '@/components/Header';

import styles from '@/styles/products.module.css';

export default function Home() {
  let index = 0;
  var splitPrices = [['']];

  const router = useRouter();
  const inRouter = router.query.category;
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (inRouter !== undefined) {
      setCategory(inRouter.toString());
    }
  }, [inRouter]);

  const { admin } = Server.useActualUserInformation();
  const { length, products, images, descriptions, prices, categories, types } = Server.useAllProducts();

  const [displayError, setDisplayError] = useState(false)
  const [select, setSelect] = useState(false);
  const [display, setDisplay] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productPriceOne, setProductPriceOne] = useState('');
  const [productPriceTwo, setProductPriceTwo] = useState('');
  const [productPriceThree, setProductPriceThree] = useState('');
  const [productCategory, setProductCategory] = useState('entertainment');
  const [productType, setProductType] = useState('product');

  const productsHTML = [];

  Server.useLoginAuthenticationInsidePage();

  for (let l = 1; l < length; l++) {
    var split = prices[l].split(', ');
    splitPrices[l] = [`${split[0]}`, `${split[1]}`, `${split[2]}`];
  }

  for (let i = 1; i < length; i++) {
    index++;

    const setPrice = () => {
      setSelect(true);
    };

    if (categories[i] === category) {
      productsHTML.push(
        <div className={styles.card} key={i}>
          <div className={styles.startSectionCard}>
            <Image className={styles.image}
              src={images[i]}
              alt={products[i]}
              width='1000'
              height='1000'
              priority={true}
            />
            <h2>{products[i]}</h2>
            <h4>{descriptions[i]}</h4>
          </div>
          <div className={styles.endSectionCard}>
            <div className={classNames(types[i] === 'gift-card' ? null : styles.hidePrices)}>
              <h4>Precio:</h4>
              <button onClick={setPrice} className={classNames(styles.predefinedPrice, select ? styles.selectPredefinedPrice : null)}>{`MX$${splitPrices[index][0]}`}</button>
              <button onClick={setPrice} className={classNames(styles.predefinedPrice, select ? styles.selectPredefinedPrice : null)}>{`MX$${splitPrices[index][1]}`}</button>
              <button onClick={setPrice} className={classNames(styles.predefinedPrice, select ? styles.selectPredefinedPrice : null)}>{`MX$${splitPrices[index][2]}`}</button>
            </div>
            <div className={classNames(types[i] === 'product' ? null : styles.hidePrices)}>
              <h4>Precio:</h4>
              <h4>{`MX$${prices[i]}`}</h4>
            </div>
            <div className={styles.quantity}>
              <h4>Cantidad:</h4>
              <input type="number" placeholder='1' />
            </div>
            <button className={styles.addToCart}>Agregar al carrito</button>
          </div>
        </div>
      )
    }
  }

  const showAddProduct = () => {
    setDisplay(!display);
  };

  const handleProductNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProductName(event.target.value);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setProductImage(event.target.files[0]);
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleProductDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProductDescription(event.target.value);
  };

  const handleProductTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setProductType(event.target.value);
  };

  const handleProductPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProductPrice(event.target.value);
  };

  const handleProductPriceOneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProductPriceOne(event.target.value);
  };

  const handleProductPriceTwoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProductPriceTwo(event.target.value);
  };

  const handleProductPriceThreeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProductPriceThree(event.target.value);
  };

  const handleProductCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setProductCategory(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (productType === 'gift-card') {
      if (productName.length <= 0 || productDescription.length <= 0 || productPriceOne.length <= 0 || productPriceTwo.length <= 0 || productPriceThree.length <= 0 || productCategory.length <= 0 || productType.length <= 0) {
        setDisplayError(!displayError);
      } else {
        if (productImage) {
          const formData = new FormData();
          formData.append("productName", productName);
          formData.append("image", productImage);
          formData.append("productDescription", productDescription);
          formData.append("productPrice", `${productPriceOne}, ${productPriceTwo}, ${productPriceThree}`);
          formData.append("productCategory", productCategory);
          formData.append("productType", productType);

          Server.addProduct({ formData });

          if (typeof window !== 'undefined') {
            window.location.href = `../categories/products?category=${category}`;
          }
        } else {
          setDisplayError(!displayError);
        }
      }
    } else {
      if (productName.length <= 0 || productDescription.length <= 0 || productPrice.length <= 0 || productCategory.length <= 0 || productType.length <= 0) {
        setDisplayError(!displayError);
      } else {
        if (productImage) {
          const formData = new FormData();
          formData.append("productName", productName);
          formData.append("image", productImage);
          formData.append("productDescription", productDescription);
          formData.append("productPrice", productPrice);
          formData.append("productCategory", productCategory);
          formData.append("productType", productType);

          Server.addProduct({ formData });

          if (typeof window !== 'undefined') {
            window.location.href = `../categories/products?category=${category}`;
          }
        } else {
          setDisplayError(!displayError);
        }
      }
    }
  };

  const hideErrorMessage = () => {
    setDisplayError(!displayError);
  }

  return <>
    <Head title='Productos' />

    <Header />

    <section className={styles.container}>{productsHTML}</section>

    <section className={classNames(styles.addProduct, display ? null : styles.hideAddProduct)}>
      <div className={classNames(styles.background)}></div>
      <div className={styles.addProductCartel}>
        <form onSubmit={handleSubmit}>
          <h2>Añade un producto</h2>
          <Image
            className={styles.image}
            src={imagePreview ? imagePreview : '/img/no-image-available(1200x600).png'}
            alt='test'
            width='1200'
            height='600'
            priority
          />
          <div>
            <label>Añade una imágen a la publicación</label>
            <h5>La imagen tiene que ser 2:1 (preferentemente 1200x600)</h5>
            <input type="file" onChange={handleFileChange} />
          </div>
          <div>
            <label>Escriba el nombre de la publicación</label>
            <input type="text" value={productName} onChange={handleProductNameChange} />
          </div>
          <div>
            <label>Escriba la descripción de la publicación</label>
            <input type="text" value={productDescription} onChange={handleProductDescriptionChange} />
          </div>
          <div>
            <label>Tipo de publicación</label>
            <select defaultValue='product' onChange={handleProductTypeChange}>
              <option value='product'>Producto normal</option>
              <option value='gift-card'>Tarjeta de regalo</option>
            </select>
          </div>
          <div className={classNames(productType === 'product' ? null : styles.hidePrice)}>
            <label>Precio</label>
            <input type="number" min='1' value={productPrice} onChange={handleProductPriceChange} />
          </div>
          <div className={classNames(productType === 'product' ? styles.hidePrice : null)}>
            <label>Precios fijos</label>
            <div>
              <input type="number" min='1' max='10000' value={productPriceOne} onChange={handleProductPriceOneChange} />
              <input type="number" min='1' max='10000' value={productPriceTwo} onChange={handleProductPriceTwoChange} />
              <input type="number" min='1' max='10000' value={productPriceThree} onChange={handleProductPriceThreeChange} />
            </div>
          </div>
          <div>
            <label>Categoría del producto</label>
            <select defaultValue={category} onChange={handleProductCategoryChange}>
              <option value="cinemex">Cinemex</option>
              <option value="cinepolis">Cinepolis</option>
              <option value="entertainment">Entretenimiento</option>
              <option value="food">Comida</option>
              <option value="games">Juegos</option>
            </select>
          </div>
          <button type='submit'>Guardar</button>
        </form>
        <button className={styles.button} onClick={showAddProduct}>Cancelar</button>
      </div>
    </section>

    <section className={classNames(styles.errorMessage, displayError ? null : styles.hideErrorMessage)}>
      <div className={styles.errorMessageBackground}></div>
      <div>
        <h1>No se han rellenado todos los campos</h1>
        <button onClick={hideErrorMessage}>Aceptar</button>
      </div>
    </section>

    <section className={classNames(styles.buttonAddProductSection, admin == 1 ? null : styles.hideButtonAddProductSection)}>
      <button onClick={showAddProduct} className={styles.buttonAddProduct}>
        <Image
          className={styles.image}
          src='/img/add.png'
          alt='add'
          width='100'
          height='100'
          priority
        />
      </button>
    </section>
  </>

}