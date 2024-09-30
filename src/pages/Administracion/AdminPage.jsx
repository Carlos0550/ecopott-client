import React from "react";
import AdminNavbar from "./Navbar/AdminNavbar";
import "./css/adminPage.css"
import { Card, Col, Row } from "antd";
import AddProducts from "../../components/CargaDeProductos/AddProducts";
import Title from "antd/es/typography/Title";
import AddCategory from "../../components/CargaDeCategorias/AddCategory";
function AdminPage() {
  


  return (
    <>
      <div className="admin_navbar">
        <AdminNavbar />
      </div>
      <div className="admin__wrapper">
        <Card title=<Title level={3}>Bienvenido al Panel de administración</Title> style={{minWidth:"100%", minHeight:"100%"}}>
        <Row gutter={16} style={{marginTop:".5rem"}}>
          <Col sx={24} md={16} sm={16} lg={14}>
            <Card>
              <AddProducts/>
            </Card>
          </Col>
          <Col sx={24} md={12} sm={12} lg={10}>
            <Card>
              <AddCategory/>
            </Card>
          </Col>
          
        </Row>
        </Card>
      </div>
    </>
  );
}

export default AdminPage;
