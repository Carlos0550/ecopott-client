import React, { useState } from "react";
import AdminNavbar from "../Navbar/AdminNavbar";
import { Col, Row, Form, Checkbox, Button, Card, Input, ConfigProvider, DatePicker, notification } from "antd";
import { useAppContext } from "../../../context";
import dayjs from 'dayjs';

function PromotionsManager() {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const { products, locale,create_promotion } = useAppContext();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [promoValue, setPromoValue] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [expDate, setExpDate] = useState(null);

  const handleFinish = (values) => {
    const formData = new FormData()
    if (!startDate || !expDate) {
      openNotification()
      return;
    }
    console.log(values)
    formData.append("productsIDs", JSON.stringify(values.groupProducts))
    formData.append("promoName", values.promoName)
    formData.append("promoPrice", values.promoPrice)
    formData.append("startDate", startDate)
    formData.append("endDate", expDate)

    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    
    create_promotion(formData)
  };

  const handleValuesChange = (changedValues, allValues) => {
    const selectedIds = allValues.groupProducts || [];
    const selected = products.filter((product) => selectedIds.includes(product.id_product));
    const total = selected.reduce((acc, item) => acc + parseFloat(item.price), 0);
    setSelectedProducts(selected);
    setTotalPrice(total);
    setPromoValue(allValues.promoPrice);
  };

  const openNotification = () => {
    api.open({
      message: 'Debe seleccionar ambas fechas!',
      description:
        'Tanto la fecha de inicio como la de fin son necesarias para activar la promoción!',
      duration: 5,
      showProgress: true
    });
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin__wrapper">
        <Row gutter={10} style={{ marginLeft: ".5rem" }}>
          <Col xs={24} sm={18} md={16} lg={12}>
            <Card title="Selección de productos">
              <Form
                name="promotionsProducts"
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                onValuesChange={handleValuesChange}
              >
                <Form.Item
                  label="Nombre de la promo"
                  name="promoName"
                  rules={[
                    {
                      required: true,
                      message: "Se necesita un nombre para la promoción",
                    },
                    {
                      validator: (_, value) => {
                        if (value.trim() === "") {
                          return Promise.reject(new Error("El nombre de la promoción no puede estar vacío"));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Precio de la promo:"
                  name="promoPrice"
                  rules={[
                    {
                      required: true,
                      message: "Indique un valor numérico mayor a 0",
                    },
                    {
                      validator: (_, value) => {
                        if (!value || isNaN(value) || Number(value) <= 0) {
                          return Promise.reject(new Error("Indique un valor numérico mayor a 0"));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input type="number" min="1" placeholder="Ingrese el precio" />
                </Form.Item>

                <Form.Item label="Válido desde:">
                  <ConfigProvider locale={locale}>
                    <DatePicker
                      format={"YYYY-MM-DD"}
                      value={startDate ? dayjs(startDate) : null}
                      onChange={(date) => {
                        setStartDate(date ? date.format("YYYY-MM-DD") : null);
                        form.setFieldsValue({ startDate: date ? date.format("YYYY-MM-DD") : null });
                      }}
                    />
                  </ConfigProvider>
                </Form.Item>

                <Form.Item label="Válido hasta:">
                  <ConfigProvider locale={locale}>
                    <DatePicker
                      format={"YYYY-MM-DD"}
                      value={expDate ? dayjs(expDate) : null}
                      onChange={(date) => {
                        setExpDate(date ? date.format("YYYY-MM-DD") : null);
                        form.setFieldsValue({ expDate: date ? date.format("YYYY-MM-DD") : null });
                      }}
                    />
                  </ConfigProvider>
                </Form.Item>

                <Form.Item
                  name="groupProducts"
                  style={{ maxHeight: 350, overflowY: "auto" }}
                  rules={[
                    {
                      validator: (_, value) => {
                        if (value && value.length >= 2) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Seleccione al menos dos productos"));
                      },
                    },
                  ]}
                >
                  <Checkbox.Group>
                    <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                      {products.map((item) => (
                        <Checkbox value={item.id_product} key={item.id_product}>
                          {item.name} - ${item.price}
                        </Checkbox>
                      ))}
                    </div>
                  </Checkbox.Group>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Crear Promoción
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col xs={24} sm={18} md={16} lg={12}>
            <Card title="Información de la promo">
              {selectedProducts.length > 0 ? (
                <ul>
                  {selectedProducts.map((product) => (
                    <li key={product.id_product}>
                      {product.name} - ${product.price}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No se han seleccionado productos aún.</p>
              )}
              <h4>
                Precio Total:{" "}
                {parseFloat(totalPrice).toLocaleString("es-ES", {
                  style: "currency",
                  currency: "ARS",
                })}
              </h4>
              <h4>
                Valor de la promo:{" "}
                {parseFloat(promoValue).toLocaleString("es-ES", {
                  style: "currency",
                  currency: "ARS",
                })}
              </h4>
              <h4>
                Validez de la promo: Desde el {startDate || "fecha no seleccionada"} hasta el{" "}
                {expDate || "fecha no seleccionada"}{" "}
                {expDate ? `(${dayjs(expDate).diff(dayjs(), "day") + 1} días)` : ""}
              </h4>
            </Card>
          </Col>
        </Row>
      </div>
      {contextHolder}
    </>
  );
}

export default PromotionsManager;
