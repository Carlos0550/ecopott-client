import React, { useState, useEffect } from "react";
import { Button, Col, Form, Input, Row, Select, Upload } from "antd";
import { useForm } from "antd/es/form/Form";
import { QuestionOutlined, UploadOutlined } from "@ant-design/icons";
import HelpModal from "./HelpModal";
import { useAppContext } from "../../context";
const { Option } = Select
function AddProducts({editing, product, productImages, closeModal}) {
  const [formProducts] = useForm();
  const [fileList, setFileList] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [helpText, setHelpText] = useState(false)
  const [savingProduct, setSavingProduct] = useState(false)
  const { createProduct,editProduct, categories } = useAppContext()

  const handleFinishProduct = async(values) => {
    setSavingProduct(true)
    editing ? await editProduct(values, product.id_product, productImages) : await createProduct(values)
    setSavingProduct(false)
    formProducts.resetFields()
    if (editing) closeModal()
  };
 useEffect(()=>{
    if (editing && product && productImages) {
      formProducts.setFieldsValue({
        productName: product.name,
        productPrice: product.price,
        productCategory: product.id_product_category,
        productDescription: product.description,
      })

      const images = productImages.map((image) => ({
        uid: image.id_image,
        name: `image-${image.id_image}.jpg`,
        status: "done",
        url: image.image_url
      }))

      setFileList(images);
      formProducts.setFieldsValue({
        productImages: images,
      });
    }
 },[editing, product, productImages])

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleHelpModal = (typeHelp = "") => {
    if(typeHelp.trim() === "helpDescription"){
        setHelpText("description")
    }
    setShowHelp(!showHelp);
  };



  return (
    <>
      <Row gutter={16}>
        <Col sx={24} lg={24}>
        <h2>Añadir Productos</h2>
          <Form
            form={formProducts}
            onFinish={handleFinishProduct}
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
                  {categories && categories.map((item) => (
                    <Option value={item.id_category} key={item.id_category}>
                      {item.name}
                    </Option>
                  ))}
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
