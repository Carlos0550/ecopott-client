import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../Componentes/Navbar/Navbar";
import "./home.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Carousel,
  Empty,
  Pagination,
  Select,
  Skeleton,
  Typography,
} from "antd";
import { config } from "../../../../config";
import { GroupImagesIntoProducts } from "../../../../utils/AdminProcessProducts";
import Search from "antd/es/transfer/search";
import { useAuthContext } from "../../../../AuthContext";
import { useAppContext } from "../../../../context";
const { Option } = Select;

const getSlidesToShow = () => {
  const width = window.innerWidth;
  if (width >= 1400) return 3;
  if (width > 768 && width < 1400) return 2;
  return 1;
};

function Home() {
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const navigate = useNavigate();
  const alreadyFetch = useRef(false);

  const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow());
  const {
    fetchAllData,
    promotions,
    productsImages,
    products,
    categories,
    settings,
    bannersImgs,
  } = useAuthContext();
  const { dayjs } = useAppContext();
  const pageEnabled = settings[0]?.page_enabled;
  console.log(promotions);
  const filteredPromotions = promotions.filter(
    (promotion) => promotion.enabled === true
  );
  console.log("Filtro: ", filteredPromotions);

  useEffect(() => {
    if (!alreadyFetch.current) {
      (async () => {
        alreadyFetch.current = true;
        setLoading(true);
        await fetchAllData();
        setLoading(false);
      })();
    }
  }, []);
  useEffect(() => {
    if (bannersImgs && bannersImgs.length > 0) {
      const bannersImages = bannersImgs.map(
        (item) => JSON.parse(item.image_urls)[0]
      );
      setBanners(bannersImages);
    }
  }, [bannersImgs]);

  useEffect(() => {
    const handleResize = () => setSlidesToShow(getSlidesToShow());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const processedProducts = GroupImagesIntoProducts(productsImages, products);
  const filteredGroupedProducts = processedProducts.filter((group) => {
    const matchesName = group.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesCategory = categoryId
      ? group.id_product_category === categoryId
      : true;
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
    navigate(`/view_products-details/${productId}`, {
      state: {
        products,
        productsImages,
        categories,
      },
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
              {pageEnabled ? (
                <>
                  <div className="carouselContainer">
                    {loading ? (
                      <Skeleton active />
                    ) : (
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
                    )}
                  </div>

                  <Card title="Promociones" style={{ height: "min-content", justifyContent: "space-evenly" }}>
                    {filteredPromotions.length > 0 ? (
                      <Carousel
                        autoplaySpeed={2000}
                        autoplay
                        arrows
                        slidesToShow={slidesToShow}
                      >
                        {filteredPromotions.map((promo) => (
                          <div
                            key={promo.id_promotion}
                            style={{
                              display: "flex",
                              justifyContent: "space-evenly"
                            }}
                          >
                            <Card
                              hoverable
                              style={{
                                width: "220px",
                                height: "300px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-evenly",
                              }}
                              cover={
                                <picture
                                  style={{
                                    height: "150px",
                                    overflow: "hidden",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <img
                                    alt={promo.name}
                                    src={promo.imageUrl}
                                    style={{
                                      height: "100%",
                                      width: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                </picture>
                              }
                            >
                              <Card.Meta
                              title={<span style={{ whiteSpace: "normal", overflow: "visible", textOverflow: "unset" }}>{promo.name}</span>}
                              description={`Precio: $${promo.price}`}
                              />
                              <p style={{ marginTop: "10px" }}>
                                {`Válido desde: ${dayjs(
                                  promo.start_date
                                ).format("DD-MM-YYYY")} hasta: ${dayjs(
                                  promo.end_date
                                ).format("DD-MM-YYYY")}`}
                              </p>
                            </Card>
                          </div>
                        ))}
                      </Carousel>
                    ) : (
                      <p>
                        Por el momento no tenemos promociones, vuelve pronto!
                      </p>
                    )}
                  </Card>

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
                    {loading ? (
                      <Skeleton active />
                    ) : (
                      paginatedProducts.map((product) => (
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
                          // actions={[
                          //   <Button type="primary" disabled>
                          //     Añadir al carrito
                          //   </Button>,
                          // ]}
                        >
                          <Card.Meta     title={<span style={{ whiteSpace: "normal", overflow: "visible", textOverflow: "unset" }}>{product.name}</span>} />
                          <p>${product.price}</p>
                        </Card>
                      ))
                    )}
                  </div>
                  <Pagination
                    current={currentPage}
                    total={filteredGroupedProducts.length}
                    pageSize={pageSize}
                    onChange={handlePaginationChange}
                    showSizeChanger
                    pageSizeOptions={[6, 12, 24]}
                  />
                </>
              ) : (
                <>
                  <Empty
                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    imageStyle={{
                      height: 120,
                    }}
                    description={
                      <Typography.Text>
                        Estamos preparando esta página con productos increíbles
                      </Typography.Text>
                    }
                  ></Empty>
                </>
              )}
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default Home;
