import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./adminNavbar.css";
import {Drawer, Flex, Space} from "antd"
import { MenuOutlined } from "@ant-design/icons"
function AdminNavbar() {
  const [openDrawer, setOpenDrawer] = useState(false)

  const handleDrawer = () =>{
    setOpenDrawer(!openDrawer)
  }
  return (
    <header className='admin__header-wrapper'>
        <nav className='admin__nav'>
            <div className="admin__brand">  
              <div className="admin_logo">
                <img src="https://placehold.jp/250x250.png" alt="logo_img" />
              </div>
              <div className='admin__title'>
                <p>Administración</p>
              </div>
            </div>
            <div className='menu_icon' onClick={()=> handleDrawer()}><MenuOutlined /></div>
            <ul className='admin__links'>
            <li className='admin__li'><Link to={"/"}>Productos/categorías</Link></li>
                <li className='admin__li'><Link to={"/view_products"}>Visualizar Página</Link></li>
                <li className='admin__li'><Link to={"/promotions"}>Promociones/banners</Link></li>
                <li className='admin__li'><Link to={"/settings"}>Ajustes</Link></li>
            </ul>
        </nav>
        <Drawer
          title="Administración"
          placement='right'
          closable={true}
          onClose={()=> handleDrawer()}
          onClick={()=> handleDrawer()}
          open={openDrawer}
        >
              <Flex vertical gap={"middle"}>
                <li className='admin__li'><Link to={"/"}>Productos/categorías</Link></li>
                <li className='admin__li'><Link to={"/view_products"}>Visualizar Página</Link></li>
                <li className='admin__li'><Link to={"/promotions"}>Promociones/banners</Link></li>
                <li className='admin__li'><Link to={"/settings"}>Ajustes</Link></li>
              </Flex>
        </Drawer>
    </header>
  )
}

export default AdminNavbar;
