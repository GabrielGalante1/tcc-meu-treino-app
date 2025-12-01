import { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ... (o type AuthContextData e a criação do context continuam iguais) ...
type AuthContextData = {
  token: string | null;
  login: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
  authInitialized: boolean;
};

const AuthContext = createContext<AuthContextData>({
  token: null,
  login: async () => {},
  logout: async () => {},
  authInitialized: false,
});


export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      console.log('1. [AuthContext] Verificando token salvo no AsyncStorage...');
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          console.log('2. [AuthContext] Token encontrado:', storedToken);
          setToken(storedToken);
        } else {
          console.log('2. [AuthContext] Nenhum token foi encontrado.');
        }
      } catch (e) {
        console.error("Erro ao carregar token:", e);
      } finally {
        console.log('3. [AuthContext] Verificação de autenticação finalizada!');
        setAuthInitialized(true);
      }
    };
    loadToken();
  }, []);
      
  const login = async (accessToken: string) => {
    setToken(accessToken);
    await AsyncStorage.setItem('token', accessToken);
  };

  const logout = async () => {
    setToken(null);
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, authInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext) as AuthContextData;
};