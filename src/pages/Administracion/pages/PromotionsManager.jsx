import React, { useEffect, useRef, useState } from "react";
import AdminNavbar from "../Navbar/AdminNavbar";
import { Col, Row, Form, Checkbox, Button, Card, Input, ConfigProvider, DatePicker, notification, message, Table, Popconfirm, Upload } from "antd";
import { useAppContext } from "../../../context";
import { scroller } from "react-scroll"
import dayjs from 'dayjs';

import Edit from "../../../SVGs/Edit" 
import DeleteIcon from "../../../SVGs/DeleteIcon"
import { processPromotions } from "../../../utils/processPromotions";
import { UploadOutlined } from "@ant-design/icons";

function PromotionsManager() {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const { products, locale,create_promotion,promotions,update_promotion,delete_promotion } = useAppContext();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [promoValue, setPromoValue] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [expDate, setExpDate] = useState(null);
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [fileList, setFileList] = useState([]);

  const [editingPromotion, setEditingPromotion] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState(null)

  const formRef = useRef(null);


  const handleFinish = async(values) => {
    const formData = new FormData()
    if (!startDate || !expDate) {
      openNotification()
      return;
    }
    setLoading(true)
    formData.append("productsIDs", JSON.stringify(values.groupProducts))
    formData.append("promoName", values.promoName)
    formData.append("promoPrice", values.promoPrice)
    formData.append("startDate", startDate)
    formData.append("endDate", expDate)
    if (startDate === dayjs().format("YYYY-MM-DD")) {
      formData.append("enabled", true)
    }else{
      formData.append("enabled", false)
    }
    if (editingPromotion) {
      formData.append("promotionID", selectedPromotion.id_promotion)
    }
    // formData.forEach((value, key) => {
    //   console.log(`${key}: ${value}`);
    // });
    
    editingPromotion ? await update_promotion(formData, selectedPromotion.id_promotion) : await create_promotion(formData)
    setLoading(false)
    form.resetFields()
    setExpDate(null)
    setStartDate(null)
    setEditingPromotion(false)
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

  const itemsPerPage = {
    pageSize: 5
}

const handleEditPromotion = (promotionID) => {
    setSelectedPromotion(promotions.find((promo) => promo.id_promotion === promotionID))    
    setEditingPromotion(true)

    scroller.scrollTo('promotionsForm', {
      duration: 500,
      delay: 0,
      smooth: 'easeInOutQuart',
    });
}

const handleDeletePromotion = async(promotionID) =>{
  setDeleting(true)
  await delete_promotion(promotionID)
  setDeleting(false)
} 


useEffect(()=> {
  if (editingPromotion && selectedPromotion) {
    const processedPromotions = processPromotions(selectedPromotion.id_product_promotion)
    form.setFieldsValue({
      promoName: selectedPromotion.name,
      promoPrice: selectedPromotion.price,
      groupProducts: processedPromotions,
      setExpDate: selectedPromotion.end_date,
      setStartDate: selectedPromotion.start_date,
    })
  }
},[editingPromotion, selectedPromotion])

const tablePromotion = [
    {
        title: "Promo",
        key: "promo",
        dataIndex: "name"
    },
    {
        title: "Precio",
        key: "price",
        render: (_,record) => (
            <p>
                {parseFloat(record.price).toLocaleString("es-AR",{style:"currency", currency: "ARS"})}
            </p>
        )
    },
    {
        title: "Fecha de comienzo",
        key: "start_date",
        render: (_,record) => (
            <p>
                {dayjs(record.start_date).format("DD-MM-YYYY")}
            </p>
        )
    },
    {
        title: "Fecha de fín",
        key: "end_date",
        render: (_,record) => (
            <p>
                {dayjs(record.end_date).format("DD-MM-YYYY")}
            </p>
        )
    },
    {
        key: "actions",
        render: (_,record) => (
            <>
                <Button type="primary" onClick={()=> handleEditPromotion(record.id_promotion)}><Edit/></Button>
                {" "}
                <Popconfirm
                onConfirm={()=>handleDeletePromotion(record.id_promotion)}
                okText="Eliminar"
                okType="danger"
                cancelText="Cancelar"
                okButtonProps={[
                  {loading: deleting}
                ]}
                title="¿Está seguro que quiere eliminar esta promoción?"
                description="Esta acción no se puede deshacer!"
                >
                  <Button type="primary" danger><DeleteIcon/></Button>
                </Popconfirm>
            </>
        )
    }
]

const handleUploadChange = ({ fileList: newFileList }) => {
  setFileList(newFileList);
};

  return (
    <>
      <AdminNavbar />
      <div className="admin__wrapper">
        <div id="promotionsForm" ref={formRef}></div>
        <Row gutter={10} style={{ marginLeft: ".5rem" }}>
          <Col xs={24} sm={18} md={16} lg={12}>
            <Card title={editingPromotion ? <>
              Editando una promoción { " " }
              <Button type="primary" danger onClick={()=> setEditingPromotion(false)}>Cancelar editado</Button>
              </> : "Crear una promoción"}>
              <h4>Selección de productos</h4>
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
                  label={"¿Que productos desea agregar a la promo/combo?"}
                  style={{ maxHeight: 350, overflowY: "auto" }}
                  rules={[
                    {
                      validator: (_, value) => {
                        if (value && value.length > 0) {
                          return Promise.resolve();
                        }
                        message.error("Seleccione al menos un producto")
                        return Promise.reject(new Error("Seleccione al menos un producto"));
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

                <Form.Item
            name="productImages"
            label="Imagen de la promo/combo"
            valuePropName="fileList"
            getValueFromEvent={(e)=> e && e.fileList}
            rules={[{ required: true, message: "Sube al menos una imagen del producto" }]}
            >
              <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={()=> false}
              >
                <Button icon={<UploadOutlined/>}>Subir Imagen</Button>
              </Upload>

            </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Crear Promoción
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          
          <Col  xs={24} sm={18} md={16} lg={12}>
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
            <br />
            <Card title="Lista de promos">
              <Table
              dataSource={promotions}
              columns={tablePromotion}
              pagination={itemsPerPage}
              scroll={{x: 500}}
              />
            </Card>
          </Col>
          
        </Row>
      </div>
      {contextHolder}
    </>
  );
}

export default PromotionsManager;
