import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../context";
import { Button, Form, Input, List, Popconfirm } from "antd";
import HelpModal from "../CargaDeProductos/HelpModal";
import { DeleteOutlined, EditOutlined, QuestionOutlined } from "@ant-design/icons";
function AddCategory() {
  const { createCategory, categories,deleteCategory, updateCategory } = useAppContext();
  const [savingCategory, setSavingCategory] = useState(false);
  const [formCategory] = Form.useForm();
  const [helpText, setHelpText] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const targetRef = useRef(null)
  const [deletingCategory, setDeletingCategory] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const handleScroll = () => {
    targetRef.current?.scrollIntoView({ behavior: 'smooth' });
  }


  const handleFinishCategory = async (values) => {
    setSavingCategory(true);
    if (selectedCategory) {
      await updateCategory(values, selectedCategory.id_category)
      setSelectedCategory(null)
    }else{
      await createCategory(values);
    }
    setSavingCategory(false);
    formCategory.resetFields();
  };
  const handleHelpModal = (typeHelp = "") => {
    if (typeHelp.trim() === "helpCategory") {
      setHelpText("description");
    }
    setShowHelp(!showHelp);
  };

  const editCategory = (id_category) => {
    setSelectedCategory(categories.find((category) => category.id_category === id_category))
    handleScroll()
  };

  const handleDeleteCategory = async(id_category) => {
    setDeletingCategory(true)
    await deleteCategory(id_category)
    setDeletingCategory(false)
  };

  useEffect(()=>{
    // console.log(selectedCategory)
    if (selectedCategory) {
      formCategory.setFieldsValue({
        categoryName: selectedCategory.name,
        description: selectedCategory.description
      })
    }
  },[selectedCategory])
  return (
    <>
      <div ref={targetRef}></div>
      
        <Form
          layout="vertical"
          name="categoryForm"
          form={formCategory}
          onFinish={handleFinishCategory}
        >
          <Form.Item
            name="categoryName"
            
            rules={[
              {
                required: true,
                message: "Es necesario un nombre para la categoría",
              },
            ]}
            label={
              <>
                Nombre de la categoria{" "}
                <span
                  style={{ marginLeft: ".3rem" }}
                  onClick={() => handleHelpModal("helpCategory")}
                >
                  <QuestionOutlined />
                </span>
              </>
            }
            style={{ width: "100%" }}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Alguna descripción muy breve">
            <Input placeholder="Plasticos de PVC" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={savingCategory}>
              Guardar Categoria
            </Button>
          </Form.Item>
        </Form>
      
      {showHelp && (
        <HelpModal closeModal={() => handleHelpModal()} helpText={helpText} />
      )}
      <div className="categories-list-container" style={{maxHeight: "500px", overflowY:"auto"}}>
      <List
      header={<h3>Lista de categorías</h3>}
      itemLayout="horizontal"
      dataSource={categories}
      renderItem={category => (
        <List.Item
        actions={[
          <Button icon={<EditOutlined />} onClick={() => editCategory(category.id_category)}>Editar</Button>,
          <Popconfirm
          onConfirm={() => handleDeleteCategory(category.id_category)}
          title="¿Confirmar eliminación?"
          description="Esta accion no se puede deshacer!"
          cancelText="Cancelar"
          okText="Eliminar"
          okType="danger"
          okButtonProps={[
            {loading: deletingCategory}
          ]}
          >
                      <Button danger icon={<DeleteOutlined />}>Eliminar</Button>

          </Popconfirm>
          ]}
        >
          <List.Item.Meta
            title={category.name}
            description={`ID: ${category.id_category}`}
          />
        </List.Item>
      )}
      >

      </List>
      </div>
      
    </>
  );
}

export default AddCategory;
