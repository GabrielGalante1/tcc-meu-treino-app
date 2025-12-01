import { View, Text, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/src/auth/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Definindo o tipo para os dados do usuário
type UserProfile = {
  nome: string;
  email: string;
};

export default function PerfilPage() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchUserProfile = async () => {
      try {
        // Lembre-se de usar o IP do seu computador aqui!
        const response = await axios.get('/api/perfil', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao buscar perfil do usuário", error);
        // Se o token for inválido, podemos forçar o logout
        Alert.alert("Sessão expirada", "Por favor, faça o login novamente.");
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [token]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" />;
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Não foi possível carregar os dados do perfil.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.info}>{user.nome}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.info}>{user.email}</Text>
      </View>

      <View style={styles.logoutButtonContainer}>
        <Button title="Sair (Logout)" onPress={logout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  infoContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  info: {
    fontSize: 20,
    fontWeight: '500',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  logoutButtonContainer: {
    marginTop: 40,
  }
});