import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '@/src/auth/AuthContext';
import { useEffect } from 'react';
import { SplashScreen } from 'expo-router';

// Garante que a tela de carregamento do app fique visível
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { token, authInitialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Se a verificação do token ainda não terminou, não fazemos nada.
    // A Splash Screen continua visível.
    if (!authInitialized) {
      return;
    }

    // Verifica se o usuário está na área principal do app (qualquer rota dentro de '(tabs)')
    const inAppGroup = segments[0] === '(tabs)';

    if (token && !inAppGroup) {
      // Usuário está logado mas não está na área do app, redireciona para lá
      router.replace('/(tabs)');
    } else if (!token) {
      // Usuário não está logado, redireciona para a tela de login
      router.replace('/login');
    }
    
    // Assim que a lógica de rota estiver resolvida, esconde a tela de carregamento
    SplashScreen.hideAsync();

  }, [token, authInitialized]); // Roda este efeito sempre que o token ou o status de inicialização mudar

  // **A GRANDE MUDANÇA ESTÁ AQUI**
  // Nós SEMPRE retornamos o componente Stack. Nunca retornamos 'null'.
  // A Splash Screen cuida de esconder a tela enquanto a lógica acima roda.
  return <Stack screenOptions={{ headerShown: false }} />;
}


export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}