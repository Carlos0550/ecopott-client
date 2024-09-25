import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../../context';
import "./css/productDetails.css"
import { Button, Popconfirm, Space, Switch } from 'antd';
import Markdown from 'react-markdown';
import EditProductModal from '../EditarProductos/EditProductModal';
import { useAuthContext } from '../../../AuthContext';
function ProductDetails() {
  const { id } = useParams(); 
  const { productsImages, products,deleteProduct,changeProductState } = useAppContext();
  const {categories} = useAuthContext()
  const [openModalEditProduct, setOpenModalEditProduct] = useState(false)
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

  const handleEditProduct = () =>{
    setOpenModalEditProduct(!openModalEditProduct)
  }

  const handleDeleteProduct = (ID) => {
    deleteProduct(ID, productImages)
  }

  const [loadingState, setLoadingState] = useState(false)
  const handleSwitchChange = async(value, productId) => {
    const formData = new FormData()
    setLoadingState(true)
    formData.append("is_available", value)
    formData.append("productId", productId)
    await changeProductState(formData)
    setLoadingState(false)
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
        <p>Categoría: {productCategoriesName}</p>
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
          {console.log(products)}
          <Space>
            <p>Disponible: </p>
          <Switch value={product?.is_available} loading={loadingState} onChange={(value)=>handleSwitchChange(value, product.id_product)}/>
          </Space>
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
