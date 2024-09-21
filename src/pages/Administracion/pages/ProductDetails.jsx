import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../../context';
import "./css/productDetails.css"
import { Button, Popconfirm } from 'antd';
import Markdown from 'react-markdown';
import EditProductModal from '../EditarProductos/EditProductModal';
function ProductDetails() {
  const { id } = useParams(); 
  const { productsImages, products,deleteProduct } = useAppContext();
  const [openModalEditProduct, setOpenModalEditProduct] = useState(false)
  const product = products.find((prod) => prod.id_product === id);
  const productImages = productsImages.filter(
    (image) => image.id_product_image === id
  );

  const [mainImage, setMainImage] = useState([]);

  const alreadySet = useRef(false)
  useEffect(() => {
    if (!alreadySet.current && productImages.length > 0) { 
      setMainImage(productImages[0]?.image_url || "");
      alreadySet.current = true;
    }
  }, [productImages]);

  const handleEditProduct = () =>{
    setOpenModalEditProduct(!openModalEditProduct)
  }

  const handleDeleteProduct = (ID) => {
    deleteProduct(ID, productImages)
  }

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
        <p>Precio: ${parseFloat(product?.price).toLocaleString("es-ES",{style:"currency", currency:"ARS"})}</p>
        <p>{product?.is_available ? 'Disponible' : 'No disponible'}</p>
        
        <div className='product-details__actions'>
          <Button type="primary" onClick={()=> handleEditProduct()}>Editar</Button>
          <Popconfirm
          title="¿Esta seguro de eliminar este producto?"
          description="Esta acción no se puede deshacer"
          onConfirm={()=>handleDeleteProduct(product.id_product)}
          >
            <Button type="danger">Eliminar</Button>
          </Popconfirm>
          <Button type="default">Marcar como Tendencia</Button>
        </div>

        <div className='product-details__description'>
          <Markdown>{product?.description}</Markdown>
        </div>
      </div>
      {openModalEditProduct && <EditProductModal closeModal={()=>handleEditProduct()} product={product} productImages={productImages}/>}
    </div>
  );
}

export default ProductDetails;
