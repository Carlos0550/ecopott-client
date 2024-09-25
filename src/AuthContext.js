import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "./supabase";
import { message } from "antd";
import axios from "axios";
import { config } from "./config";
export const AuthContext = createContext();

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      "useAuthContext debe ser utilizado dentro de un AppContextProvider"
    );
  }
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [cloudinaryUsage, setCloudinaryUsage] = useState([]);
  const [supabaseUsage, setSupabaseUsage] = useState([]);
  const [errorGettingUsages, setErrorGettingUsages] = useState(false);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsImages, setProductsImages] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [productsView, setProductsView] = useState([]);
  const [settings, setSettings] = useState([])
  const [bannersImgs, setBannersImgs] = useState([]);

  const getUsages = async () => {
    setErrorGettingUsages(false);
    try {
      const response = await axios.get(`${config.apiBaseUrl}/get-usages`);
      if (response.status === 200) {
        setSupabaseUsage(response.data.availableSpace);
        setCloudinaryUsage(response.data.cloudinaryUsage);
      } else {
        message.error(`${response.data.message}`);
        setErrorGettingUsages(true);
      }
    } catch (error) {
      console.log(error);
      setErrorGettingUsages(true);
      if (error.response) {
        message.error(`${error.response.data.message}`);
      } else {
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente",
          5
        );
      }
    }
  };
  const fetchAllData = async () => {
    const hiddenMessage = message.loading("Aguarde un momento...", 0);
    try {
      const response = await axios.get(`${config.apiBaseUrl}/fetch-all-data`);
      await getUsages();
      if (response.status === 200) {
        setCategories(response.data.categories);
        setProductsImages(response.data.product_images);
        setProducts(response.data.products);
        setPromotions(response.data.promotions);
        setProductsView(response.data.products_view);
        setSettings(response.data.settings);
        setBannersImgs(response.data.bannersImgs)
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
const alreadyCheck = useRef(false)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          const userId = data.session.user.id;

          if (userId === process.env.REACT_APP_SUPABASE_ADMIN_ID) {
            setIsAuthenticated(true);
            setIsAdmin(true);
            await fetchAllData();
          } else {
            setIsAuthenticated(true);
            setIsAdmin(false);
          }
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error al verificar sesión:", error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };
    if (!alreadyCheck.current) {
      alreadyCheck.current = true
      checkSession();
    }
  }, [isAuthenticated, isAdmin]);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error || !data.user) {
        return false;
      }

      const userId = data.user.id;

      if (userId === process.env.REACT_APP_SUPABASE_ADMIN_ID) {
        setIsAuthenticated(true);
        setIsAdmin(true);
        navigate("/");
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      return true;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate("/home");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        login,
        logout,
        productsView,
        promotions,
        productsImages,
        products,
        categories,
        settings,
        bannersImgs,
        errorGettingUsages,
        supabaseUsage,
        cloudinaryUsage,
        setCloudinaryUsage,
        setSupabaseUsage,
        setErrorGettingUsages,
        setCategories,
        setProducts,
        setProductsImages,
        setPromotions,
        setProductsView,
        fetchAllData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
