import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useAuth } from '@/src/auth/AuthContext'; // Importe o hook

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth(); // Use a função de login do contexto

  const handleLogin = async () => {
    setError(null);
    try {
      // Lembre-se de usar o IP do seu computador aqui, não 10.0.2.2 se for testar na web ou celular físico
      const res = await fetch('/api/login', { // <-- TROQUE PELO SEU IP
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Erro no login');

      await login(data.access_token); // Chama a função do contexto para salvar o token e redirecionar

    } catch (e: any) {
      setError(e.message ?? 'Erro desconhecido');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoComplete='email' />
      <TextInput placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} style={styles.input} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center', gap: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6 },
  error: { color: 'red', alignSelf: 'center' },
});