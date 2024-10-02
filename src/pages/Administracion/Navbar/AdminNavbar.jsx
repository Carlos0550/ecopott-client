import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./adminNavbar.css";
import { Drawer, Flex } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import LogoImage from "../../../Logo/logo.png";

function AdminNavbar() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  // Efecto para detectar el scroll y cambiar la clase
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.admin__header-wrapper');
      const nav = document.querySelector('.admin__nav');
      
      // Detectamos si la `nav` sale del `header`
      if (window.scrollY > header.offsetHeight) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className='admin__header-wrapper'>
      <nav className={`admin__nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="admin__brand">  
          <div className="admin_logo">
            <img src={LogoImage} alt="logo_img" />
          </div>
          <div className='admin__title'>
            <p>Administración</p>
          </div>
        </div>
        <div className='menu_icon' onClick={handleDrawer}><MenuOutlined /></div>
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
        onClose={handleDrawer}
        onClick={handleDrawer}
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
  );
}

export default AdminNavbar;
