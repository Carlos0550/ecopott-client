import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { Drawer, Flex, Space } from "antd";
import { HomeFilled, MenuOutlined } from "@ant-design/icons";
function Navbar() {
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };
  return (
    <header className="admin__header-wrapper">
      <nav className="admin__nav">
        <div className="admin__brand">
          {/* <div className="admin_logo">
                <img src="https://placehold.jp/250x250.png" alt="logo_img" />
              </div> */}
          <div className="admin__title">
            <p>Macetas Brian</p>
          </div>
        </div>
        <div className="menu_icon" onClick={() => handleDrawer()}>
          <MenuOutlined />
        </div>
        <ul className="admin__links">
          <li className="admin__li">
            <Link to={"/home"}><HomeFilled style={{fontSize: "2rem"}}/></Link>
          </li>
          {/* <li className="admin__li">
            <Link to={"/home/promociones"}>Promociones/Ofertas</Link>
          </li> */}
        </ul>
      </nav>
      <Drawer
        title="Administración"
        placement="right"
        closable={true}
        onClose={() => handleDrawer()}
        onClick={() => handleDrawer()}
        open={openDrawer}
      >
        <Flex vertical gap={"middle"}>
          <li className="admin__li">
            <Link to={"/home"}><HomeFilled/> Inicio</Link>
          </li>
          {/* <li className="admin__li">
            <Link to={"/home/promociones"}>Promociones/Ofertas</Link>
          </li> */}
        </Flex>
      </Drawer>
    </header>
  );
}

export default Navbar;
