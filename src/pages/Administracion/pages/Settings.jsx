import React from "react";
import AdminNavbar from "../Navbar/AdminNavbar";
import { Button, Card, Col, Divider, Row, Statistic, Switch } from "antd";
import { useAppContext } from "../../../context";

function Settings() {
  const { cloudinaryUsage, getUsages, errorGettingUsages, supabaseUsage } =
    useAppContext();

  const getGbToBytes = (gb) => {
    return gb * 1073741824;
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

  return (
    <>
      <AdminNavbar />
      <div className="admin__wrapper">
        <h2 style={{color: errorGettingUsages ? "red" : ""}}>{errorGettingUsages ? <>Error obteniendo los datos de uso <Button type="primary" danger onClick={()=> getUsages()}>Reintentar</Button></> : "Ajustes e información"}</h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={18} md={15} lg={12}>
            <Card>
              <Statistic
                title="Espacio disponible en la Base de Datos"
                value={getSupabaseSpace()}
              />
              <Statistic
                title="Espacio disponible para almacenar imágenes"
                value={getUsageCloudinary()}
              />
            </Card>
          </Col>
          <Col xs={24} sm={18} md={15} lg={12}>
            <Card title="Ajustes de la página">
                <h3>Habilitar página</h3>
                <Switch></Switch>
                <Divider/>
                
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Settings;
