import { StyledImage } from '@/hooks/StyledComponents';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

import * as Server from '@/hooks/Server';

import styles from './styles/styles.module.css';

export default function AddProducts() {
  const [showAddProducts, setShowAddProducts] = useState<boolean>(false);

  const [dateAdded, setDateAdded] = useState<string>('');

  const [productImagePreview, setProductImagePreview] = useState<string>('');
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productName, setProductName] = useState<string>('');
  const [productDescription, setProductDescription] = useState<string>('');
  const [productType, setProductType] = useState<string>('product');
  const [productPrice, setProductPrice] = useState<string>('');
  const [productPriceOne, setProductPriceOne] = useState<string>('');
  const [productPriceTwo, setProductPriceTwo] = useState<string>('');
  const [productPriceThree, setProductPriceThree] = useState<string>('');
  const [productCategory, setProductCategory] = useState<string>('cinemex');

  useEffect(() => {
    const date = new Date();
    const dateToMili = date.getTime();
    setDateAdded(dateToMili.toString());
  }, [])

  const handleShowAddProduct = () => {
    setShowAddProducts(!showAddProducts);

    setProductImagePreview('');
    setProductImage(null);
    setProductName('');
    setProductDescription('');
    setProductType('product');
    setProductPrice('');
    setProductPriceOne('');
    setProductPriceTwo('');
    setProductPriceThree('');
    setProductCategory('cinemex');
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setProductImage(event.target.files[0]);
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setProductImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleProductNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProductName(event.target.value);
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

    const formData = new FormData();

    if (productType === 'gift-card') {
      formData.append("productPrice", `${productPriceOne}, ${productPriceTwo}, ${productPriceThree}`);
    } else {
      formData.append("productPrice", productPrice);
    }

    if (productImage) {
      formData.append("productImage", productImage);
    }

    formData.append("dateAdded", dateAdded);
    formData.append("productName", productName);
    formData.append("productType", productType);
    formData.append("productCategory", productCategory);
    formData.append("productDescription", productDescription);
    
    Server.addProduct({ formData });

    if (typeof window !== 'undefined') {
      window.location.href = `../products?category=${productCategory}`;
    }
  };

  return <>
    <button onClick={handleShowAddProduct} className={styles.button}>{'Añade un nuevo producto'}</button>

    {
      showAddProducts ?
        <section className={styles.addProduct}>
          <div className={styles.background} />
          <form onSubmit={handleSubmit} className={styles.addProductCartel}>
            <h2>{'Añade un producto'}</h2>
            <StyledImage className={styles.styledImage} src={productImagePreview ? productImagePreview : ''} />
            <div className={styles.labelInputFile}>
              <label>{'Añade una imágen a la publicación'}</label>
              <h5>{'Preferentemente 1200x600'}</h5>
              <input type="file" required={true} onChange={handleFileChange} />
            </div>
            <div className={styles.labelInput}>
              <label>{'Escriba el nombre de la publicación'}</label>
              <input type="text" required={true} value={productName} onChange={handleProductNameChange} />
            </div>
            <div className={styles.labelInput}>
              <label>{'Escriba la descripción de la publicación'}</label>
              <input type="text" required={true} value={productDescription} onChange={handleProductDescriptionChange} />
            </div>
            <div className={styles.labelInput}>
              <label>{'Tipo de publicación'}</label>
              <select defaultValue='product' required={true} onChange={handleProductTypeChange}>
                <option value='product'>{'Producto normal'}</option>
                <option value='gift-card'>{'Tarjeta de regalo'}</option>
              </select>
            </div>
            {
              productType === 'product' ?
                <div className={styles.labelInput}>
                  <label>{'Precio'}</label>
                  <input type="number" required={true} min='1' value={productPrice} onChange={handleProductPriceChange} />
                </div>
                :
                <div className={styles.labelInput}>
                  <label>{'Precios fijos'}</label>
                  <div className={styles.inputs}>
                    <input type="number" max='10000' required={true} value={productPriceOne} onChange={handleProductPriceOneChange} />
                    <input type="number" max='10000' required={true} value={productPriceTwo} onChange={handleProductPriceTwoChange} />
                    <input type="number" max='10000' required={true} value={productPriceThree} onChange={handleProductPriceThreeChange} />
                  </div>
                </div>
            }
            <div className={styles.labelInput}>
              <label>{'Categoría del producto'}</label>
              <select required={true} onChange={handleProductCategoryChange}>
                <option value="cinemex">{'Cinemex'}</option>
                <option value="cinepolis">{'Cinepolis'}</option>
                <option value="entertainment">{'Entretenimiento'}</option>
                <option value="food">{'Comida'}</option>
                <option value="games">{'Juegos'}</option>
              </select>
            </div>
            <div className={styles.buttons}>
              <button type='submit'>{'Guardar'}</button>
              <button type='button' onClick={handleShowAddProduct}>{'Cancelar'}</button>
            </div>
          </form>
        </section>
        :
        null
    }
  </>
}