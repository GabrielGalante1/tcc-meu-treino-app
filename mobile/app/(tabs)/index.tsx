import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '@/src/auth/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MainPage() {
  const { token } = useAuth();
  const [datasTreinadas, setDatasTreinadas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchResumoSemana = async () => {
      try {
        // Lembre-se de usar o IP do seu computador aqui!
        const response = await axios.get('/api/registros/semana', { 
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setDatasTreinadas(response.data);
      } catch (error) {
        console.error("Erro ao buscar resumo da semana", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResumoSemana();
  }, [token]);

  // Se estiver carregando, mostra um indicador
  if (loading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" />;
  }

  // Gera os últimos 7 dias da semana para exibição
  const semana = Array.from({ length: 7 }).map((_, i) => {
    const data = new Date();
    data.setDate(data.getDate() - i);
    return data;
  }).reverse(); // .reverse() para começar com o dia mais antigo

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progresso da Semana</Text>
      <View style={styles.semanaContainer}>
        {semana.map((dia, index) => {
          const diaString = dia.toISOString().split('T')[0];
          const treinou = datasTreinadas.includes(diaString);
          const diaDaSemana = dia.toLocaleDateString('pt-BR', { weekday: 'short' }).substring(0, 3).toUpperCase();

          return (
            <View key={index} style={styles.diaContainer}>
              <Text style={styles.diaTexto}>{diaDaSemana}</Text>
              <View style={styles.circulo}>
                <Text style={styles.iconeTexto}>{treinou ? '✔' : '❌'}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 30,
  },
  semanaContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around',
    width: '100%', // Ocupa toda a largura
  },
  diaContainer: {
    alignItems: 'center',
  },
  diaTexto: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  circulo: {
    width: 40,
    height: 40,
    borderRadius: 20, // Metade da largura/altura para ser um círculo perfeito
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    elevation: 2,
  },
  iconeTexto: {
    fontSize: 20,
  },
});