import React, { useState, useEffect } from "react";
import { Button, Col, Form, Input, Row, Select, Upload } from "antd";
import { useForm } from "antd/es/form/Form";
import { QuestionOutlined, UploadOutlined } from "@ant-design/icons";
import HelpModal from "./HelpModal";
import { useAppContext } from "../../../../../context";
const { Option } = Select
function AddProducts() {
  const [formProducts] = useForm();
  const [formCategory] = useForm();
  const [fileList, setFileList] = useState([]);

  const [showHelp, setShowHelp] = useState(false);
  const [helpText, setHelpText] = useState(false)
  const [savingProduct, setSavingProduct] = useState()
  const { createProduct } = useAppContext()

  const handleFinish = async(values) => {
    setSavingProduct(true)
    await createProduct(values)
    setSavingProduct(false)
    formProducts.resetFields()
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    console.log(newFileList)
  };

  const handleHelpModal = (typeHelp = "") => {
    if (typeHelp.trim() === "helpCategory") {
        setHelpText("category")
    }else if(typeHelp.trim() === "helpDescription"){
        setHelpText("description")
    }
    setShowHelp(!showHelp);
  };

  


  return (
    <>
      <Row gutter={16}>
        <Col sx={24} md={16} sm={16} lg={12}>
        <h2>Añadir Productos</h2>
          <Form
            form={formProducts}
            onFinish={handleFinish}
            name="addProducts"
            layout="vertical"
          >
            <Form.Item
              name="productName"
              label="Nombre del producto"
              rules={[
                { required: true, message: "Escriba el nombre del producto" },
              ]}
            >
              <Input placeholder="Maceta terracota" />
            </Form.Item>
            <Form.Item
              name="productPrice"
              label="Precio del producto"
              rules={[
                { required: true, message: "Escriba el precio del producto" },
              ]}
            >
              <Input placeholder="$8500" />
            </Form.Item>
            
            <Form.Item
                name="productCategory"
                label="Asigna una categoría"
                rules={[
                    {required: true, message: "Asignar una categoría es obligatoria"}
                ]}
                
            >
                <Select id="productCategory" allowClear>
                    <Option value="1">
                        Cemento
                    </Option>
                </Select>
            </Form.Item>

            Como hacer más atractiva la descripción del producto{" "}
                <Button onClick={() => handleHelpModal("helpDescription")}>
                <QuestionOutlined />
                </Button>
                <br />
            <Form.Item
              name="productDescription"
              label="Descripción del producto"
              rules={[
                { required: true, message: "Escriba el nombre del producto" },
              ]}
            >
                
              <Input.TextArea placeholder="Maceta terracota" rows={8} />
            </Form.Item>

            <Form.Item
            name="productImages"
            label="Imagenes del producto"
            valuePropName="fileList"
            getValueFromEvent={(e)=> e && e.fileList}
            rules={[{ required: true, message: "Sube al menos una imagen del producto" }]}
            >
              <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={()=> false}
              multiple
              >
                <Button icon={<UploadOutlined/>}>Subir Imagenes</Button>
              </Upload>

            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={savingProduct}>Guardar Producto</Button>
            </Form.Item>
          </Form>
        </Col>
        <Col sx={24} md={18} sm={20} lg={12}>
        <h2>Añadir Categorias</h2>

          <Form 
          layout="vertical"
          name="categoryForm"
          form={formCategory}
          >
            <Form.Item
            name="categoryName"
            label= {<>Nombre de la categoria <span style={{marginLeft: ".3rem"}} onClick={()=> handleHelpModal("helpCategory")}><QuestionOutlined/></span></>}
            style={{width:"100%"}}
            >
                <Input/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Guardar Categoria</Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      {showHelp && (
            <HelpModal
              closeModal={() => handleHelpModal()}
              helpText={helpText}
            />
          )}
    </>
  );
}

export default AddProducts;
