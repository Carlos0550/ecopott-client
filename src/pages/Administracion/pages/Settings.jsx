import React, { useEffect, useState } from "react";
import AdminNavbar from "../Navbar/AdminNavbar";
import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Row,
  Form,
  Statistic,
  Switch,
  Upload,
  Input,
  Table,
  Popconfirm,
} from "antd";
import { useAppContext } from "../../../context";
import { useNavigate } from "react-router-dom";
import Markdown from "react-markdown";
import { UploadOutlined } from "@ant-design/icons";
import { useAuthContext } from "../../../AuthContext";

function Settings() {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const { cloudinaryUsage, getUsages, errorGettingUsages, supabaseUsage,uploadBanner,deleteBanner, switchSettings } =
    useAppContext();
  const { settings } = useAuthContext()
  const pageEnabled = settings[0]?.page_enabled
  const {bannersImgs} = useAuthContext()
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const getGbToBytes = (gb) => {
    return gb * 1073741824;
  };

  const onFinish = async(values) => {
    const formData = new FormData();

    fileList.forEach((file) => {
      formData.append("bannerImages", file.originFileObj);
    });
    formData.append("bannerName", values.bannerName);
    setLoading(true)
    await uploadBanner(formData)
    setLoading(false)
    form.resetFields()
    setFileList([])
  }

  const handleSwitchChange = async(value) => {
    setLoading(true)
    await switchSettings(value)
    setLoading(false)
  }

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };


  const getUsageCloudinary = () => {
    if (cloudinaryUsage && cloudinaryUsage.storage) {
      const gbToBytes = getGbToBytes(25);
      const usage = gbToBytes - cloudinaryUsage.storage.usage;

      return `${(usage / 1073741824).toFixed(2)} GB`;
    }
    return "0 GB";
  };

  const getSupabaseSpace = () => {
    if (supabaseUsage && supabaseUsage.length > 0) {
      const { tables_size } = supabaseUsage[0];
      const sizePlan = 500 * 1024;

      if (typeof tables_size === "string" && tables_size.includes("kB")) {
        const kbUsage =
          parseFloat(tables_size.replace(" kB", "").trim()) * 1024;
        const usage = sizePlan - kbUsage;

        return `${(usage / 1024).toFixed(1)} MB`;
      } else {
        return "Datos no válidos";
      }
    }
    return "0 MB";
  };

  const [deletingBanner, setDeletingBanner] = useState(false);
  const handleDeleteBanner =async (id, urls) => {
    console.log(id)
    setDeletingBanner(true)  
   await deleteBanner(id,urls)
    setDeletingBanner(false)
  }

  const tableBanners = [
  {
    title: "Banner",
    dataIndex: "nombre_banner",
    key:"nombre_banner",
  },
  {
    title: "Imagen",  
    key:"imagen",
    render: (_, record) => {
      return (
        <img
          src={record.imagen_urls}
          alt={record.id}
          style={{ width: "100px", height: "auto", borderRadius:"1rem", objectFit:"cover" }}
        />
      );
    },
  },
  {
    title: "Acciones",
    dataIndex: "actions",
    key:"actions",
    render: (_, record) => {
      return (
        <Popconfirm
        title="¿Estás seguro de eliminar este banner?"
        onConfirm={() => handleDeleteBanner(record.id, record.imagen_urls)}
        okText="Si"
        cancelText="No"
        okButtonProps={[
          {
            loading: deletingBanner,
          },
        ]}
        >
        <Button
          type="primary"
          danger
          
        >
          Eliminar
        </Button>
        </Popconfirm>
      );
    },
  }
]

const processedBanners = []
if (bannersImgs && bannersImgs.length > 0) {
  bannersImgs.forEach((banner) => {
    const url = JSON.parse(banner.image_urls)[0]
    processedBanners.push({
      key: banner.id,
      id: banner.id,
      nombre_banner: banner.nombre_banner,
      imagen_urls: url
    })
  })
}else{
  processedBanners.push({
    key: 0,
    id: 0,
    nombre_banner: "No hay banners cargados",
    imagen_urls: ""
  })
}

  return (
    <>
      <AdminNavbar />
      <div className="admin__wrapper">
        <h2 style={{ color: errorGettingUsages ? "red" : "" }}>
          {errorGettingUsages ? (
            <>
              Error obteniendo los datos de uso{" "}
              <Button type="primary" danger onClick={() => getUsages()}>
                Reintentar
              </Button>
            </>
          ) : (
            "Ajustes e información"
          )}
        </h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={18} md={15} lg={12}>
            <Card title="Espacio disponible">
              {
                <Markdown>
                  - ### Podrá seguir agregando productos mientras alguno de
                  estos dos factores no llegue a 0
                </Markdown>
              }
              <Statistic
                title={
                  <Markdown>
                    - ### Espacio disponible en la Base de Datos
                  </Markdown>
                }
                value={getSupabaseSpace()}
              />
              <Statistic
                title={
                  <Markdown>
                    - ### Espacio disponible para almacenar imágenes
                  </Markdown>
                }
                value={getUsageCloudinary()}
              />
            </Card>
          </Col>
          <Col xs={24} sm={18} md={16} lg={8}>
            <Card title="Ajustes de la página">
              <h3>Habilitar página</h3>
              <Switch loading={loading} onChange={handleSwitchChange} value={pageEnabled}></Switch>{" "}
              <Button onClick={() => navigate("/home")}>Visitar Tienda</Button>
              
            </Card>
            <Card title="Cargar imagenes al banner">
              <Form
                name="bannerImages"
                layout="vertical"
                form={form}
                onFinish={onFinish} // Define tu función de envío
              >
                <Form.Item
                name="bannerName"
                label="Nombre del banner"
                rules={[{ required: true, message: "Por favor, ingresa el nombre del banner" }]}
                >
                  <Input />
                </Form.Item>
  
                <Form.Item
                  name="productImages"
                  label="Subir una imagen"
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
                    {fileList.length > 0 ? null : (
                      <Button icon={<UploadOutlined/>}>Subir Imagenes</Button>
                    )}

                  </Upload>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>Guardar</Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={18} md={15} lg={12}>
          <Card title="Lista de banners cargados">
              <Table 
              dataSource={processedBanners}
              columns={tableBanners}
              scroll={{ x: 800 }}
              />
            </Card>
            
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Settings;
