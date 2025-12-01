import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Image } from 'react-native'; // 1. Importa o componente Image
import axios from 'axios';
import { useAuth } from '@/src/auth/AuthContext';
import { Picker } from '@react-native-picker/picker';
import { useRouter, Stack } from 'expo-router';

// Tipo para o Catálogo de Exercícios (agora com gif_url)
type ExercicioCatalogo = {
  id: number;
  nome: string;
  gif_url: string; 
};

// Tipo para um Exercício dentro do nosso formulário
type ExercicioForm = {
  exercicio_id: string | number;
  series: string;
  repeticoes: string;
  descanso_seg: string;
  peso: string;
};


export default function CriarTreinoPage() {
  const { token } = useAuth();
  const router = useRouter();

  // Estados do formulário
  const [nomeTreino, setNomeTreino] = useState('');
  const [diaTreino, setDiaTreino] = useState('');
  const [exercicios, setExercicios] = useState<ExercicioForm[]>([
    { exercicio_id: '', series: '', repeticoes: '', descanso_seg: '', peso: '' }
  ]);
  const [catalogoExercicios, setCatalogoExercicios] = useState<ExercicioCatalogo[]>([]);

  // Busca o catálogo de exercícios ao carregar a tela
  useEffect(() => {
    const buscarCatalogo = async () => {
      if (!token) return;
      try {
        const response = await axios.get('http://192.168.0.15:5000/api/exercicios', { // <-- Lembre-se de usar seu IP
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setCatalogoExercicios(response.data);
      } catch (error) {
        console.error("Erro ao buscar catálogo", error);
      }
    };
    buscarCatalogo();
  }, [token]);

  // Funções para manipular a lista dinâmica de exercícios (com tipos)
  const handleExercicioChange = (index: number, name: keyof ExercicioForm, value: string | number) => {
    const novosExercicios = [...exercicios];
    (novosExercicios[index] as any)[name] = value;
    setExercicios(novosExercicios);
  };

  const adicionarExercicio = () => {
    setExercicios([...exercicios, { exercicio_id: '', series: '', repeticoes: '', descanso_seg: '', peso: '' }]);
  };

  const removerExercicio = (index: number) => {
    const novosExercicios = [...exercicios];
    novosExercicios.splice(index, 1);
    setExercicios(novosExercicios);
  };
  
  // Função para enviar os dados para o backend
  const handleSubmit = async () => {
    if (!token) return;
    const novoTreino = {
      nome: nomeTreino,
      dia: diaTreino,
      exercicios: exercicios,
    };

    try {
      await axios.post('/api/treinos', novoTreino, { // <-- Lembre-se de usar seu IP
        headers: { 'Authorization': `Bearer ${token}` }
      });
      Alert.alert('Sucesso!', 'Treino criado com sucesso!');
      router.back();
    } catch (error) {
      console.error("Erro ao criar treino", error);
      Alert.alert('Erro', 'Não foi possível criar o treino. Verifique os campos.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Novo Treino' }} />
      <Text style={styles.title}>Criar Nova Ficha de Treino</Text>
      
      <TextInput style={styles.input} placeholder="Nome do Treino (Ex: Treino A)" value={nomeTreino} onChangeText={setNomeTreino} />
      <TextInput style={styles.input} placeholder="Dia/Grupo Muscular (Ex: Segunda-feira)" value={diaTreino} onChangeText={setDiaTreino} />
      
      <Text style={styles.subtitle}>Exercícios</Text>
      {exercicios.map((ex, index) => {
        // Lógica para encontrar o GIF do exercício selecionado
        const exercicioSelecionado = catalogoExercicios.find(catEx => catEx.id == ex.exercicio_id);

        return (
          <View key={index} style={styles.exercicioCard}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={ex.exercicio_id}
                onValueChange={(itemValue) => handleExercicioChange(index, 'exercicio_id', itemValue)}
              >
                <Picker.Item label="Selecione um exercício..." value="" />
                {catalogoExercicios.map(catEx => (
                  <Picker.Item key={catEx.id} label={catEx.nome} value={catEx.id} />
                ))}
              </Picker>
            </View>

            {/* 2. Exibição do GIF (renderização condicional) */}
            {exercicioSelecionado && exercicioSelecionado.gif_url && (
              <Image
                source={{ uri: exercicioSelecionado.gif_url }}
                style={styles.gif}
              />
            )}

            <TextInput style={styles.input} placeholder="Séries (Ex: 3)" value={ex.series} onChangeText={(val) => handleExercicioChange(index, 'series', val)} />
            <TextInput style={styles.input} placeholder="Repetições (Ex: 10-12)" value={ex.repeticoes} onChangeText={(val) => handleExercicioChange(index, 'repeticoes', val)} />
            <TextInput style={styles.input} placeholder="Descanso (em segundos)" value={ex.descanso_seg} onChangeText={(val) => handleExercicioChange(index, 'descanso_seg', val)} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Peso (opcional)" value={ex.peso} onChangeText={(val) => handleExercicioChange(index, 'peso', val)} />
            
            {index > 0 && <Button title="Remover Exercício" color="red" onPress={() => removerExercicio(index)} />}
          </View>
        );
      })}
      <Button title="+ Adicionar Exercício" onPress={adicionarExercicio} />
      <View style={{ marginTop: 30, marginBottom: 50 }}>
        <Button title="Salvar Treino Completo" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 20, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10, backgroundColor: '#f9f9f9' },
  exercicioCard: { padding: 15, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 15, backgroundColor: '#fafafa' },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 10, backgroundColor: '#f9f9f9', justifyContent: 'center' },
  // 3. Novo estilo para o GIF
  gif: {
    width: 150,
    height: 150,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 10,
    backgroundColor: '#e0e0e0' // Um fundo cinza enquanto o GIF carrega
  }
});