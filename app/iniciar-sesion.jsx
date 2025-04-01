import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useSession } from '../ctx';
import { useRouter } from 'expo-router';

export default function SignIn() {
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert('Error al Iniciar Sesión', error.message);
    }
  };

  const handleSignUpPress = () => {
    router.push('/registrarse');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>✨ Iniciar Sesión ✨</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>🚀 Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={handleSignUpPress}>
        <Text style={styles.secondaryButtonText}>Crear Cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fondo negro
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  heading: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFD700', // Amarillo
    textShadowColor: '#FFA500',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 55,
    backgroundColor: '#111',
    borderColor: '#FFD700',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#FFD700',
    fontSize: 16,
    marginBottom: 20,
    shadowColor: '#FFD700',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 25,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    marginTop: 20,
  },
  secondaryButtonText: {
    color: '#FFD700',
    fontSize: 16,
    textDecorationLine: 'underline',
    textShadowColor: '#FFA500',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
