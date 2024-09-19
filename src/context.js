import { message } from "antd";
import { useContext, createContext } from "react";
import { config } from "./config";
import axios from "axios"
export const AppContext = createContext()

export const useAppContext = () =>{
    const ctx = useContext(AppContext)
    if (!ctx) {
        throw new Error("useAppContext debe ser utilizado dentro de un AppContextProvider");
    }
    return ctx
}

export const AppContextProvider = ({children}) => {

  const createProduct = async (product) => {
    const hiddenMessage = message.loading("Guardando Producto...");
  
    const formData = new FormData();
    formData.append("productName", product.productName);
    formData.append("productPrice", product.productPrice);
    formData.append("productCategory", product.productCategory);
    formData.append("productDescription", product.productDescription);
  
    product.productImages.forEach((image) => {
      formData.append("productImages", image.originFileObj);
    });
  
    try {
      const response = await axios.post(`${config.apiBaseUrl}/upload-product`, formData);
  
      hiddenMessage();
  
      if (response.status === 200) {
        message.success("Producto añadido correctamente!");
      } else {
        message.error("Hubo un error al añadir el producto!");
      }
    } catch (error) {
      hiddenMessage();
      console.error("Error al crear producto:", error);
      message.error("Hubo un error al añadir el producto!");
    }
  };
  
      
      

    return (
        <AppContext.Provider value={{
            createProduct
        }}>
            {children}
        </AppContext.Provider>
    )
    
}