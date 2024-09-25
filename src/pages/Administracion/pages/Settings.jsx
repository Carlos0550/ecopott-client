import React, { useState } from "react";
import AdminNavbar from "../Navbar/AdminNavbar";
import {
  Button,
  Card,
  Col,
  Row,
  Form,
  Statistic,
  Switch,
  Table,
  Popconfirm,
  message,
  Space,
  Flex,
} from "antd";
import { useAppContext } from "../../../context";
import { useNavigate } from "react-router-dom";
import Markdown from "react-markdown";
import { useAuthContext } from "../../../AuthContext";
import { PaperClipOutlined } from "@ant-design/icons";

function Settings() {
  const navigate = useNavigate();
  const {
    cloudinaryUsage,
    getUsages,
    errorGettingUsages,
    supabaseUsage,
    switchSettings,
  } = useAppContext();
  const { settings } = useAuthContext();
  const pageEnabled = settings[0]?.page_enabled;
  const [loading, setLoading] = useState(false);
  const getGbToBytes = (gb) => {
    return gb * 1073741824;
  };

  const handleSwitchChange = async (value) => {
    setLoading(true);
    await switchSettings(value);
    setLoading(false);
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

  const handleCopyLink = () =>{
    const link = `https://macetas-brian.vercel.app/home`
    navigator.clipboard.writeText(link)
    .then(()=>{
      message.success("Link copiado al portapapeles")
    })
    .catch(()=>{
      message.error("Error al copiar el link")
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
          <Col xs={24} sm={18} md={16} lg={12}>
            <Card title="Ajustes de la página">
            <Flex wrap gap="1rem">

              <h3>Habilitar página</h3>
              <Switch
                loading={loading}
                onChange={handleSwitchChange}
                value={pageEnabled}
              ></Switch>{" "}
              {pageEnabled ? <Button onClick={()=> handleCopyLink()}>Copiar Link <PaperClipOutlined/></Button> : ""}
              {pageEnabled ? <Button onClick={() => navigate("/home")}>Visitar Tienda</Button> : ""}
              
              </Flex>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Settings;
