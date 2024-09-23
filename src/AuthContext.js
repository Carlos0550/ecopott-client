import { createContext,useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './supabase'; 

export const AuthContext = createContext();

export const useAuthContext = () =>{
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error("useAuthContext debe ser utilizado dentro de un AppContextProvider");
    }
    return ctx
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          const userId = data.session.user.id;

          if (userId === process.env.REACT_APP_SUPABASE_ADMIN_ID) {
            setIsAuthenticated(true);
            setIsAdmin(true);
          } else {
            setIsAuthenticated(true);
            setIsAdmin(false);
          }
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };
    checkSession();
  }, [isAuthenticated,isAdmin]);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
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
      console.error('Error al iniciar sesión:', error);
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
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout 

    }}>
      {children}
    </AuthContext.Provider>
  );
};
