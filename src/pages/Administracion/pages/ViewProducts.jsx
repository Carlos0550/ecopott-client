import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AdminNavbar from '../Navbar/AdminNavbar';
import { useAppContext } from '../../../context';
import { GroupImagesIntoProducts } from '../../../utils/AdminProcessProducts';
import { Button, Card, Select } from 'antd';
import ProductDetails from './ProductDetails'; // Importa el componente de detalles del producto
import "./css/viewProducts.css"
import Search from 'antd/es/input/Search';


const { Option } = Select
function ViewProducts() {
  const { productsImages, products, categories } = useAppContext();
  const [searchText, setSearchText] = useState("")
  const [categoryId, setCategoryId] = useState(null)
  const navigate = useNavigate();

  const GroupedProducts = GroupImagesIntoProducts(productsImages, products);

  const filteredGroupedProducts = GroupedProducts.filter((group) => {
    const matchesName = group.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = categoryId ? group.id_product_category === categoryId : true;
  
    return matchesName && matchesCategory;
  });

  const handleCardClick = (productId) => {
    navigate(`/view_products/${productId}`); 
  };

  

  return (
    <>
      <AdminNavbar />
      <div className="admin__wrapper" >
        <Routes>
          <Route
            path="/"
            element={
                <div className='admin__wrapper'>
                      <div className="product__actions">
                        <Search className='search_product' placeholder='Buscá rápido un producto' allowClear onChange={(e) => setSearchText(e.target.value)} />
                        <Select id='productCategory' className='category__selector' allowClear onChange={(ID) => setCategoryId(ID)}>
                          {categories.map((item)=> (
                            <Option id={item.id_category} key={item.id_category}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    <div className="products__container">
                     
                        {filteredGroupedProducts.map((product) => (
                       <Card
                       key={product.id_product}
                       className='product__card'
                       hoverable
                       cover={
                         product.imagenes.length > 0 ? (
                           <img src={product.imagenes[0].image_url} className='card__img' alt={product.name} />
                         ) : (
                           <div className='card__img' style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
                             No Image
                           </div>
                         )
                       }
                       onClick={() => handleCardClick(product.id_product)}
                       actions={[
                         <Button type='primary' disabled>Añadir al carrito</Button>
                       ]}
                     >
                       <Card.Meta title={product.name} />
                       <p>${product.price}</p>
                     </Card>
                     
                      ))}
                    </div>
                </div>
            }
          />
         
          <Route path=":id" element={<ProductDetails />} />
        </Routes>
      </div>
    </>
  );
}

export default ViewProducts;
