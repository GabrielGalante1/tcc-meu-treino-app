import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { useAuth } from '@/src/auth/AuthContext';
import { Link, useFocusEffect } from 'expo-router';

// Definindo os tipos para os dados que esperamos da API
type Treino = {
  id: number;
  nome: string;
  dia: string;
};

export default function TreinosPage() {
  const { token } = useAuth();
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar os treinos do backend
  const buscarTreinos = async () => {
    if (!token) return;
    try {
      setLoading(true);
      // Lembre-se de usar o IP do seu computador aqui!
      const response = await axios.get('http://192.168.0.15:5000/api/treinos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTreinos(response.data);
    } catch (error) {
      console.error('Erro ao buscar treinos:', error);
      Alert.alert('Erro', 'Não foi possível carregar seus treinos.');
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect garante que a lista seja recarregada toda vez que o usuário entrar nesta tela
  useFocusEffect(
    React.useCallback(() => {
      buscarTreinos();
    }, [token])
  );

  // Função para apagar um treino
  const handleApagarTreino = async (treinoId: number) => {
    if (!window.confirm('Tem certeza que deseja apagar este treino? Esta ação não pode ser desfeita.')) return;
    try {
      await axios.delete(`http://192.168.0.15:5000/api/treinos/${treinoId}`, { // <-- TROQUE PELO SEU IP
        headers: { 'Authorization': `Bearer ${token}` }
      });
      Alert.alert('Sucesso', 'Treino apagado!');
      buscarTreinos(); // Re-busca os treinos para atualizar a lista
    } catch (error) {
      console.error('Erro ao apagar treino:', error);
      Alert.alert('Erro', 'Não foi possível apagar o treino.');
    }
  };

  // Função para registrar um treino como feito
  const handleMarcarFeito = async (treinoId: number) => {
    if (!token) return;
    try {
      await axios.post('http://192.168.0.15:5000/api/registros', // <-- TROQUE PELO SEU IP
      { treino_id: treinoId }, 
      {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      Alert.alert('Parabéns!', 'Treino de hoje registrado com sucesso! Verifique seu progresso na tela de Início.');
    } catch (error) {
      console.error('Erro ao registrar treino:', error);
      Alert.alert('Erro', 'Não foi possível registrar o treino.');
    }
  };

  // Se estiver carregando, mostra o indicador de atividade
  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  // Renderiza a tela
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Treinos</Text>
        <Link href="/criar-treino" asChild>
          <Button title="+ Novo Treino" />
        </Link>
      </View>

      {treinos.length === 0 ? (
        <Text style={styles.emptyText}>Você ainda não criou nenhum treino. Clique em "+ Novo Treino" para começar!</Text>
      ) : (
        treinos.map(treino => (
          <View key={treino.id} style={styles.card}>
            <Text style={styles.cardTitle}>{treino.nome}</Text>
            <Text style={styles.cardSubtitle}>{treino.dia}</Text>
            
            {/* Futuramente, podemos adicionar um botão para expandir e ver os exercícios aqui */}
            
            <View style={styles.buttonContainer}>
              <Button title="Editar" onPress={() => { /* Lógica de edição virá aqui */ }} />
              <Button title="Apagar" color="#E53935" onPress={() => handleApagarTreino(treino.id)} />
            </View>
            <View style={{marginTop: 10}}>
              <Button title="Marcar como Feito Hoje" color="#43A047" onPress={() => handleMarcarFeito(treino.id)} />
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#f2f2f2' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20,
    paddingTop: 30, // Espaçamento para o topo (safe area)
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold' 
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  card: { 
    backgroundColor: 'white', 
    borderRadius: 8, 
    padding: 20, 
    marginBottom: 15, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardTitle: { 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    gap: 10, 
    marginTop: 10 
  },
});