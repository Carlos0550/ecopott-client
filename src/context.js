import { message } from "antd";
import { useContext, createContext, useState, useEffect, useRef } from "react";
import { config } from "./config";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/es"
import locale from "antd/es/locale/es_ES"

dayjs.locale("es")
export const AppContext = createContext()

export const useAppContext = () =>{
    const ctx = useContext(AppContext)
    if (!ctx) {
        throw new Error("useAppContext debe ser utilizado dentro de un AppContextProvider");
    }
    return ctx
}

export const AppContextProvider = ({children}) => {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [productsImages, setProductsImages] = useState([])
  const [promotions, setPromotions] = useState([])
  const [productsView, setProductsView] = useState([])
  const navigate = useNavigate()

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
    
      if (response.status === 200) {
        message.success("Producto añadido correctamente!");
        fetchAllData()
      } else {
        message.error("Hubo un error al añadir el producto!");
      }
    } catch (error) {
      console.error("Error al crear producto:", error);
      message.error("Hubo un error al añadir el producto!");
    }finally{
      hiddenMessage()
    }
  };

  const createCategory = async(categoryName) => {
    const hiddenMessage = message.loading("Creando categoría...",0)
    try {
      const response = await axios.post(`${config.apiBaseUrl}/create-category`, categoryName)
      if (response.status === 200) {
        message.success(`${response.data.message}`);
        fetchAllData()
      } else {
        message.error(`${response.data.message}`,5);
      }
    } catch (error) {
      if (error.response) {
        message.error(`${error.response.data.message}`,5);
      }else{
        message.error("Error de conexión, verifique su internet e intente nuevamente",5)
      }
    }finally{
      hiddenMessage()
    }
  };

  const fetchAllData = async() => {
    const hiddenMessage = message.loading("Aguarde un momento...",0)
    try {
      const response = await axios.get(`${config.apiBaseUrl}/fetch-all-data`)
      
      if (response.status === 200) {
        setCategories(response.data.categories)
        setProductsImages(response.data.product_images)
        setProducts(response.data.products)
        setPromotions(response.data.promotions)
        setProductsView(response.data.products_view)
      }else{
        message.error(`${response.data.message}`)
      }
    } catch (error) {
      console.log(error)
      if (error.response) {
        message.error(`${error.response.data.message}`)
      }else{
        message.error("Error de conexión, verifique su internet e intente nuevamente",5)
      }
    }finally{
      hiddenMessage()
    }
  }

  const alreadyFetch = useRef(false)
  useEffect(()=>{
    if (!alreadyFetch.current) {
      (async()=>{
        alreadyFetch.current = true
        await fetchAllData()
      })()
    }
  },[])
  
  const editProduct = async(product, id, lastImages) => {
    const { productImages } = product;
    const hiddenMessage = message.loading("Actualizando...")
    const formData = new FormData();
    const newImages = [];
  
    productImages.forEach(img => {
      if (img.originFileObj) {
        newImages.push(img.originFileObj);
      }
    });

    const imagesToDelete = lastImages.filter((lastImg) => 
    !productImages.some((img) => img.uid === lastImg.id_image) 
    )
    console.log(imagesToDelete)
    formData.append("productName", product.productName);
    formData.append("productPrice", product.productPrice);
    formData.append("productCategory", product.productCategory);
    formData.append("productDescription", product.productDescription);
    formData.append("imagesToDelete", JSON.stringify(imagesToDelete))
    newImages.forEach((image) => {
      formData.append("newImages", image); 
    });

      try {
        const response = await axios.post(`${config.apiBaseUrl}/update-product/${id}`, formData)
        if (response.status === 200) {
          message.success(`${response.data.message}`)
          fetchAllData()
          
        }else{
          message.error(`${response.data.message}`)
        }
      } catch (error) {
        console.log(error)
        if (error.response) {
          message.error(`${error.response.data.message}`)
        }else{
          message.error("Error de conexión, verifique su internet e intente nuevamente",5)
        }
      }finally{
        hiddenMessage()
      }
  };

  const deleteProduct = async(productID, productImages) =>{
    const hiddenMessage = message.loading("Eliminando...",0)
    try {
      const response = await axios.delete(`${config.apiBaseUrl}/delete-product/${productID}`, {
        data: {images: productImages}
      })
      if (response.status === 200) {
        message.success(`${response.data.message}`)
        navigate("/view_products")
        fetchAllData()
      }else{
        message.error(`${response.data.message}`)
      }
    } catch (error) {
      console.log(error)
        if (error.response) {
          message.error(`${error.response.data.message}`)
        }else{
          message.error("Error de conexión, verifique su internet e intente nuevamente",5)
        }
    }finally{
      hiddenMessage()
    }
  };

  const deleteCategory = async(ID) => {

    const hiddenMessage = message.loading("Eliminando...",0)
    try {
      const response = await axios.delete(`${config.apiBaseUrl}/delete-category/${ID}`)
      if (response.status === 200) {
        message.success(`${response.data.message}`)
        navigate("/")
        fetchAllData()
      }else{
        message.error(`${response.data.message}`)
      }
    } catch (error) {
      console.log(error)
        if (error.response) {
          message.error(`${error.response.data.message}`)
        }else{
          message.error("Error de conexión, verifique su internet e intente nuevamente",5)
        }
    }finally{
      hiddenMessage()
    }
  }

  const updateCategory = async(newCategory,ID) => {

    const hiddenMessage = message.loading("Actualizando...",0)
    try {
      const response = await axios.put(`${config.apiBaseUrl}/update-category/${ID}`, {
        data: newCategory
      })
      
      if (response.status === 200) {
        message.success(`${response.data.message}`)
        fetchAllData()
      }else{
        message.error(`${response.data.message}`)
      }
    } catch (error) {
      console.log(error)
        if (error.response) {
          message.error(`${error.response.data.message}`)
        }else{
          message.error("Error de conexión, verifique su internet e intente nuevamente",5)
        }
    }finally{
      hiddenMessage()
    }
  }

  const create_promotion = async(values) => {
    const hiddenMessage = message.loading("Aguarde...",0)
    
    try {
      const response = await axios.post(`${config.apiBaseUrl}/create-promotion`, values)
      if (response.status === 200) {
        message.success(`${response.data.message}`)
        fetchAllData()
      }else{
        message.error(`${response.data.message}`)
      }
    } catch (error) {
      
    }finally{
      hiddenMessage()
    }
  }
  
  
  
      

    return (
        <AppContext.Provider value={{
            locale, dayjs,
            createProduct,
            createCategory,
            products,categories,productsView, productsImages, promotions,
            editProduct,deleteProduct,
            deleteCategory,updateCategory,
            create_promotion,
        }}>
            {children}
        </AppContext.Provider>
    )
    
}