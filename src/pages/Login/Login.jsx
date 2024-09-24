import { Form, Input, Button } from "antd";
import React, { useEffect, useState } from "react";
import "./login.css"
import { useAuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const {login, isAdmin} = useAuthContext()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  useEffect(()=>{
    if (isAdmin) {
      navigate("/")
    }
  },[isAdmin])
  const onFinish = async(values) => {
    setLoading(true)
    await login(values.email, values.password);
    setLoading(false)
  };

  return (
    <>
      <div className="form__wrapper">
        <Form name="loginForm" id="loginForm" onFinish={onFinish} layout="vertical">
          <h2>Bienvenido nuevamente!</h2>

          <Form.Item
            name="email"
            id="form_email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Por favor, ingresa un correo electrónico válido",
              },
            ]}
          >
            <Input placeholder="john@gmail.com" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "La contraseña es requerida",
              },
            ]}
          >
            <Input.Password placeholder="Contraseña" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Iniciar sesión
            </Button>
          </Form.Item>
          <p>¿No es administrador? <Button onClick={()=> navigate("/home")}>Ir a la tienda</Button></p>
        </Form>
      </div>
    </>
  );
}

export default Login;
