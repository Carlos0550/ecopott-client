import React from "react";
import AdminNavbar from "./Navbar/AdminNavbar";
import "./adminPage.css"
import { Card, Col, Row,Form } from "antd";
import { useForm } from "antd/es/form/Form";
import AddProducts from "./Navbar/Componentes/CargaDeProductos/AddProducts";
import Title from "antd/es/typography/Title";
function AdminPage() {
  


  return (
    <>
      <div className="admin_navbar">
        <AdminNavbar />
      </div>
      <div className="admin__wrapper">
        <Card title=<Title level={3}>Bienvenido al Panel de administración</Title> style={{minWidth:"100%", minHeight:"100%"}}>
        <Row gutter={16} style={{marginTop:".5rem"}}>
          <Col sx={24} md={16} sm={16} lg={16}>
            <Card>
              <AddProducts/>
            </Card>
          </Col>
          <Col sx={24} md={12} sm={12} lg={8}>
            <Card>
              Aca ira el formulario para añadir Cositas al banner 
            </Card>
          </Col>
          <Col sx={24} md={12} sm={12} lg={8}>
            <Card>
              Aca ira un selector para añadir Ofertas 
            </Card>
          </Col>
        </Row>
        </Card>
      </div>
    </>
  );
}

export default AdminPage;
