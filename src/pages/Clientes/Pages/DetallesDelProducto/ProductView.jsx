import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../../../context';
import "./productDetails.css"
import { Button, Popconfirm } from 'antd';
import Markdown from 'react-markdown';
import { useAuthContext } from '../../../../AuthContext';
function ProductView() {
  const { id } = useParams(); 
  const { productsImages, products } = useAppContext();
  const {categories} = useAuthContext()

  const product = products.find((prod) => prod.id_product === id);
  const productImages = productsImages.filter(
    (image) => image.id_product_image === id
  );
  const productCategoriesName = categories.find((cat) => cat.id_category === product?.id_product_category)?.name
  const [mainImage, setMainImage] = useState([]);

  const alreadySet = useRef(false)
  useEffect(() => {
    if (!alreadySet.current && productImages.length > 0) { 
      setMainImage(productImages[0]?.image_url || "");
      alreadySet.current = true;
    }
  }, [productImages]);

  return (
    <div className='products-details__wrapper'>
      <div className='product-details__imgs'>
        <img
          src={mainImage}
          alt={`Imagen principal del producto ${product?.name}`}
          className='product__main-image'
        />
        <div className='product-details__thumbnails'>
          {productImages.map((image) => (
            <img
              key={image?.id_image}
              src={image?.image_url}
              alt={`Imagen del producto ${product?.name}`}
              className='product__thumbnail'
              onClick={() => setMainImage(image?.image_url)}
            />
          ))}
        </div>
      </div>

      <div className='product-details__info'>
        <h1>{product?.name}</h1>
        <p>Categoría: {productCategoriesName}</p>
        <p>Precio: {parseFloat(product?.price).toLocaleString("es-AR",{style:"currency", currency:"ARS"})}</p>
        <p>{product?.is_available ? 'Disponible' : 'No disponible'}</p>
        <div className='product-details__description'>
          <Markdown>{product?.description}</Markdown>
        </div>
      </div>
    </div>
  );
}

export default ProductView;
