import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false }}>
      <Tabs.Screen
        name="index" // Tela de Início (Resumo da Semana)
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="treinos" // Tela de "Meus Treinos"
        options={{
          title: 'Treinos',
          tabBarIcon: ({ color }) => <FontAwesome name="list-alt" size={28} color={color} />,
        }}
      />
      
      {/* --- NOVA ABA ADICIONADA AQUI --- */}
      <Tabs.Screen
        name="perfil" // Corresponde ao arquivo perfil.tsx
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={28} color={color} />,
        }}
      />

    </Tabs>
  );
}