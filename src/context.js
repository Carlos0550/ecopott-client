import { message } from "antd";
import { useContext, createContext, useState } from "react";
import { config } from "./config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/es";
import locale from "antd/es/locale/es_ES";
import { useAuthContext } from "./AuthContext";
import { ProcessImages } from "./utils/ProcesarImages";
dayjs.locale("es");
export const AppContext = createContext();

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error(
      "useAppContext debe ser utilizado dentro de un AppContextProvider"
    );
  }
  return ctx;
};

export const AppContextProvider = ({ children }) => {
  const {
    productsView,
    promotions,
    productsImages,
    products,
    categories,
    errorGettingUsages,
    supabaseUsage,
    cloudinaryUsage,
    fetchAllData,
  } = useAuthContext();
  const navigate = useNavigate();


  const createProduct = async (product) => {
    const hiddenMessage = message.loading("Guardando Producto...");

    const images = product.productImages;
    const processedImages = await ProcessImages(images);

    const formData = new FormData();
    formData.append("productName", product.productName);
    formData.append("productPrice", product.productPrice);
    formData.append("productCategory", product.productCategory);
    formData.append("productDescription", product.productDescription);

    processedImages.forEach((image) => {
      formData.append("productImages", image);
    });

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/upload-product`,
        formData
      );

      if (response.status === 200) {
        message.success("Producto añadido correctamente!");
        fetchAllData();
      } else {
        message.error("Hubo un error al añadir el producto!");
      }
    } catch (error) {
      console.error("Error al crear producto:", error);
      message.error("Hubo un error al añadir el producto!");
    } finally {
      hiddenMessage();
    }
  };

  const createCategory = async (categoryName) => {
    const hiddenMessage = message.loading("Creando categoría...", 0);
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/create-category`,
        categoryName
      );
      if (response.status === 200) {
        message.success(`${response.data.message}`);
        fetchAllData();
      } else {
        message.error(`${response.data.message}`, 5);
      }
    } catch (error) {
      if (error.response) {
        message.error(`${error.response.data.message}`, 5);
      } else {
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente",
          5
        );
      }
    } finally {
      hiddenMessage();
    }
  };

  const editProduct = async (product, id, lastImages) => {
    const { productImages } = product;
    
    const hiddenMessage = message.loading("Actualizando...");
    const formData = new FormData();
    
    const newImages = productImages.filter((img) => img.originFileObj);
  
    let processedImages = [];
    if (newImages.length > 0) {
      try {
        processedImages = await ProcessImages(newImages);
        console.log("Imágenes procesadas:", processedImages);
      } catch (error) {
        console.error("Error procesando imágenes:", error);
        message.error("Error procesando imágenes, Verifica que las imagenes estén en un formato adecuado.", 5);
      }
    }
  
    const imagesToDelete = lastImages.filter(
      (lastImg) => !productImages.some((img) => img.uid === lastImg.id_image)
    );
  
    formData.append("productName", product.productName);
    formData.append("productPrice", product.productPrice);
    formData.append("productCategory", product.productCategory);
    formData.append("productDescription", product.productDescription);
    formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
  
    processedImages.forEach((image) => {
      formData.append("newImages", image);
    });
  
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/update-product/${id}`,
        formData
      );
      if (response.status === 200) {
        message.success(`${response.data.message}`);
        fetchAllData();
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.log("Error al actualizar el producto:", error);
      if (error.response) {
        message.error(`${error.response.data.message}`);
      } else {
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente",
          5
        );
      }
    } finally {
      hiddenMessage();
    }
  };
  
  

  const deleteProduct = async (productID, productImages) => {
    const hiddenMessage = message.loading("Eliminando...", 0);
    try {
      const response = await axios.delete(
        `${config.apiBaseUrl}/delete-product/${productID}`,
        {
          data: { images: productImages },
        }
      );
      if (response.status === 200) {
        message.success(`${response.data.message}`);
        navigate("/view_products");
        fetchAllData();
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        message.error(`${error.response.data.message}`);
      } else {
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente",
          5
        );
      }
    } finally {
      hiddenMessage();
    }
  };

  const deleteCategory = async (ID) => {
    const hiddenMessage = message.loading("Eliminando...", 0);
    try {
      const response = await axios.delete(
        `${config.apiBaseUrl}/delete-category/${ID}`
      );
      if (response.status === 200) {
        message.success(`${response.data.message}`);
        navigate("/");
        fetchAllData();
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        message.error(`${error.response.data.message}`);
      } else {
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente",
          5
        );
      }
    } finally {
      hiddenMessage();
    }
  };

  const updateCategory = async (newCategory, ID) => {
    const hiddenMessage = message.loading("Actualizando...", 0);
    try {
      const response = await axios.put(
        `${config.apiBaseUrl}/update-category/${ID}`,
        {
          data: newCategory,
        }
      );

      if (response.status === 200) {
        message.success(`${response.data.message}`);
        fetchAllData();
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        message.error(`${error.response.data.message}`);
      } else {
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente",
          5
        );
      }
    } finally {
      hiddenMessage();
    }
  };

  const create_promotion = async (values) => {
    const hiddenMessage = message.loading("Aguarde...", 0);
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/create-promotion`,
        values
      );
      if (response.status === 200) {
        message.success(`${response.data.message}`);
        fetchAllData();
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        message.error(`${error.response.data.message}`);
      } else {
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente",
          5
        );
      }
    } finally {
      hiddenMessage();
    }
  };

  const update_promotion = async (values) => {
    const hiddenMessage = message.loading("Aguarde...", 0);

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/update-promotion`,
        values
      );
      if (response.status === 200) {
        message.success(`${response.data.message}`);
        fetchAllData();
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        message.error(`${error.response.data.message}`);
      } else {
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente",
          5
        );
      }
    } finally {
      hiddenMessage();
    }
  };

  const delete_promotion = async (promotionID, imageUrl) => {
    const hiddenMessage = message.loading("Aguarde...", 0);
    console.log(imageUrl)
    try {
      const response = await axios.delete(
        `${config.apiBaseUrl}/delete-promotion/${promotionID}?imageUrl=${encodeURIComponent(imageUrl)}`
      );
      if (response.status === 200) {
        message.success(`${response.data.message}`);
        fetchAllData();
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        message.error(`${error.response.data.message}`);
      } else {
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente",
          5
        );
      }
    } finally {
      hiddenMessage();
    }
  };

  const uploadBanner =async (values) => {
    const hiddenMessage = message.loading("Aguarde...", 0);

    try { 
      const response = await axios.post(`${config.apiBaseUrl}/upload_banner`, values);
      console.log(response)
      if (response.status === 200) {
        message.success(`${response.data.message}`);
        fetchAllData();
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        message.error(`${error.response.data?.message}`);
      } else {
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente",
          5
        );
      }
    } finally {
      hiddenMessage();
    }
  }

  const deleteBanner = async(id, urls) => {
    const hiddenMessage = message.loading("Aguarde...", 0);
    try {
      const response = await axios.delete(`${config.apiBaseUrl}/delete_banner/${id}`,{
        data: {imageUrl: urls}
      });
      if (response.status === 200) {
        message.success(`${response.data.message}`);
        fetchAllData();
      }else{
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.log(error)
      if(error.response){
        message.error(`${error.response.data.message}`)
      }else{
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente",
          5
        );
      }
    }finally{
      hiddenMessage()
    }
  }

  const switchSettings = async (values) => {
    const hiddenMessage = message.loading("Aguarde...", 0);
    try {
      const response = await axios.put(`${config.apiBaseUrl}/update_settings`, {values});
      if (response.status === 200) {
        message.success(`${response.data.message}`);
        fetchAllData();
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        message.error(`${error.response.data.message}`);
      } else {
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente",
          5
        );
      }
    } finally {
      hiddenMessage();
    }
  };

  const changeProductState = async(formData) => {
    const hiddenMessage = message.loading("Aguarde...", 0);
    try {
      const response = await axios.put(`${config.apiBaseUrl}/update_product_state`, formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      if (response.status === 200) {
        message.success(`${response.data.message}`);
        fetchAllData();
      }else{
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.log(error)
      if(error.response){
        message.error(`${error.response.data.message}`)
      }else{
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente",
          5
        );
      }
    }finally{
      hiddenMessage()
    }
  }
  return (
    <AppContext.Provider
      value={{
        locale,
        dayjs,
        errorGettingUsages,
        supabaseUsage,
        cloudinaryUsage,
        fetchAllData,
        createProduct,
        createCategory,
        products,
        categories,
        switchSettings,
        productsImages,
        promotions,
        deleteBanner,
        editProduct,
        deleteProduct,
        deleteCategory,
        updateCategory,
        create_promotion,
        update_promotion,
        delete_promotion,
        uploadBanner,
        changeProductState
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
