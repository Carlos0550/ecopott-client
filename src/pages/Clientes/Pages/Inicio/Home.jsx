import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../Componentes/Navbar/Navbar";
import "./home.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Button, Card, Carousel, Pagination, Select } from "antd";
import { config } from "../../../../config";
import { GroupImagesIntoProducts } from "../../../../utils/AdminProcessProducts";
import Search from "antd/es/transfer/search";

const { Option } = Select;

const getSlidesToShow = () => {
  const width = window.innerWidth;
  if (width >= 1400) return 3;
  if (width > 768 && width < 1400) return 2;
  return 1;
};

function Home() {
  const [loading, setLoading] = useState(false);
  const [serverData, setServerData] = useState([]);
  const [banners, setBanners] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const navigate = useNavigate();
  const alreadyFetch = useRef(false);
  const [categories, setCategories] = useState([]);
  const [productsImages, setProductsImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow());

  useEffect(() => {
    if (!alreadyFetch.current) {
      alreadyFetch.current = true;
      setLoading(true);
      fetch(`${config.apiBaseUrl}/get_products_view`)
        .then((res) => res.json())
        .then((data) => {
          setServerData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    if (serverData) {
      const { bannersImgs, categories, products, productImages } = serverData;

      if (bannersImgs) {
        const bannersImages = bannersImgs.map((item) => JSON.parse(item.image_urls)[0]);
        setBanners(bannersImages);
      }

      if (categories) {
        setCategories(categories);
      }

      if (products) {
        setProducts(products);
      }

      if (productImages) {
        setProductsImages(productImages);
      }
    }
  }, [serverData]);

  useEffect(() => {
    const handleResize = () => setSlidesToShow(getSlidesToShow());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const processedProducts = GroupImagesIntoProducts(productsImages, products);
  const filteredGroupedProducts = processedProducts.filter((group) => {
    const matchesName = group.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = categoryId ? group.id_product_category === categoryId : true;
    return matchesName && matchesCategory;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const handlePaginationChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const paginatedProducts = useMemo(() => {
    return filteredGroupedProducts.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filteredGroupedProducts, currentPage, pageSize]);

  const handleCardClick = (productId) => {
    navigate(`/view_products-details/${productId}`,{
      state: {
        products,
        productsImages,
        categories
      }
    });
  };

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/*"
          element={
            <div className="home__wrapper">
              <div className="carouselContainer">
                <Carousel autoplay arrows slidesToShow={slidesToShow}>
                  {banners.map((item, index) => (
                    <div key={index} className="imageContainer">
                      <img
                        src={item}
                        alt={`imagen-producto-${item}`}
                        className="carouselImg"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
              <div className="home__product__actions">
                <Search
                  className="home__search_product"
                  placeholder="Buscá rápido un producto"
                  allowClear
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Select
                  id="productCategory"
                  className="home__category__selector"
                  placeholder="Buscá por categoría"
                  allowClear
                  onChange={(ID) => setCategoryId(ID)}
                >
                  {categories.map((item) => (
                    <Option key={item.id_category} value={item.id_category}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="home__products__container">
                {paginatedProducts.map((product) => (
                  <Card
                    key={product.id_product}
                    className="home__product__card"
                    hoverable
                    cover={
                      product.imagenes.length > 0 ? (
                        <img
                          src={product.imagenes[0].image_url}
                          className="home__card__img"
                          alt={product.name}
                        />
                      ) : (
                        <div
                          className="home__card__img"
                          style={{
                            height: "200px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#f0f0f0",
                          }}
                        >
                          No Image
                        </div>
                      )
                    }
                    onClick={() => handleCardClick(product.id_product)}
                    actions={[
                      <Button type="primary" disabled>
                        Añadir al carrito
                      </Button>,
                    ]}
                  >
                    <Card.Meta title={product.name} />
                    <p>${product.price}</p>
                  </Card>
                ))}
              </div>
              <Pagination
                current={currentPage}
                total={filteredGroupedProducts.length}
                pageSize={pageSize}
                onChange={handlePaginationChange}
                showSizeChanger
                pageSizeOptions={[6, 12, 24]}
              />
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default Home;
