import { useState, ChangeEvent, FormEvent } from 'react';

import Image from 'next/image';
import Server from '@/hooks/Server';
import classNames from 'classnames';

import styles from './styles/styles.module.css';

export default function AddNewProduct({ category }: { category: string }) {
  const { admin } = Server.useActualUserInformation();
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
      if (productName.length >= 0 || productDescription.length >= 0 || productPriceOne.length >= 0 || productPriceTwo.length >= 0 || productPriceThree.length >= 0 || productCategory.length >= 0 || productType.length >= 0) {
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
        }
      }
    } else {
      if (productName.length >= 0 || productDescription.length >= 0 || productPrice.length >= 0 || productCategory.length >= 0 || productType.length >= 0) {
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
        }
      }
    }
  };

  const showAddProduct = () => {
    setDisplay(!display);
  };

  return <>
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
            <input type="file" required={true} onChange={handleFileChange} />
          </div>
          <div>
            <label>Escriba el nombre de la publicación</label>
            <input type="text" required={true} value={productName} onChange={handleProductNameChange} />
          </div>
          <div>
            <label>Escriba la descripción de la publicación</label>
            <input type="text" required={true} value={productDescription} onChange={handleProductDescriptionChange} />
          </div>
          <div>
            <label>Tipo de publicación</label>
            <select defaultValue='product' required={true} onChange={handleProductTypeChange}>
              <option value='product'>Producto normal</option>
              <option value='gift-card'>Tarjeta de regalo</option>
            </select>
          </div>
          <div className={classNames(productType === 'product' ? null : styles.hidePrice)}>
            <label>Precio</label>
            <input type="number" required={true} min='1' value={productPrice} onChange={handleProductPriceChange} />
          </div>
          <div className={classNames(productType === 'product' ? styles.hidePrice : null)}>
            <label>Precios fijos</label>
            <div>
              <input type="number" max='10000' required={true} value={productPriceOne} onChange={handleProductPriceOneChange} />
              <input type="number" max='10000' required={true} value={productPriceTwo} onChange={handleProductPriceTwoChange} />
              <input type="number" max='10000' required={true} value={productPriceThree} onChange={handleProductPriceThreeChange} />
            </div>
          </div>
          <div>
            <label>Categoría del producto</label>
            <select required={true} onChange={handleProductCategoryChange}>
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

    <section className={classNames(styles.buttonAddProductSection, admin == 1 ? null : styles.hideButtonAddProductSection)}>
      <button onClick={showAddProduct} className={styles.buttonAddProduct}>
        <Image
          className={styles.image}
          src='/img/add.png'
          alt='add'
          width='100'
          height='100'
          priority={true}
        />
      </button>
    </section>

  </>
}