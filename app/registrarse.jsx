import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useSession } from '../ctx';
import { useRouter } from 'expo-router';

export default function SignUp() {
  const { signUp } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const validateEmail = (email) => {
    // Regex para validar el formato del email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignUp = async () => {
    let isValid = true;

    // Validación del Email
    if (!email) {
      setEmailError('El email es requerido');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Formato de email inválido');
      isValid = false;
    } else {
      setEmailError(''); // Limpiar el error si es válido
    }

    // Validación de la Contraseña
    if (!password) {
      setPasswordError('La contraseña es requerida');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      isValid = false;
    } else {
      setPasswordError(''); // Limpiar el error si es válido
    }

    if (isValid) {
      try {
        await signUp(email, password);
        // El inicio de sesión ocurre automáticamente en ctx.js tras el registro exitoso
        Alert.alert('Registro Exitoso', 'Serás redireccionado.');
      } catch (error) {
        Alert.alert('Error al Registrarse', error.message);
      }
    } else {
      // Si no es válido, no enviar el formulario y los errores ya se mostrarán
      Alert.alert("Por favor, corrige los errores para continuar.")
    }
  };

  const handleSignInPress = () => {
    router.push('/iniciar-sesion');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Crear Cuenta</Text>

      <TextInput
        style={[styles.input, emailError && styles.inputError]}
        placeholder="Email"
        value={email}
        placeholderTextColor="#888"
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        onBlur={() => {
          if (!email) {
            setEmailError('El email es requerido');
          } else if (!validateEmail(email)) {
            setEmailError('Formato de email inválido');
          } else {
            setEmailError('');
          }
        }}
      />
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

      <TextInput
        style={[styles.input, passwordError && styles.inputError]}
        placeholder="Contraseña"
        value={password}
        placeholderTextColor="#888"
        onChangeText={setPassword}
        secureTextEntry
        onBlur={() => {
          if (!password) {
            setPasswordError('La contraseña es requerida');
          } else if (password.length < 6) {
            setPasswordError('La contraseña debe tener al menos 6 caracteres');
          } else {
            setPasswordError('');
          }
        }}
      />
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Crear Cuenta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={handleSignInPress}>
        <Text style={styles.secondaryButtonText}>¿Ya tienes cuenta? Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000', // Fondo negro
  },
  heading: {
    fontSize: 32,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#A020F0', // Morado
    textShadowColor: '#8A2BE2',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#A020F0',
    borderWidth: 1.5,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#111', // Más oscuro
    fontSize: 16,
    color: '#FFD700',
    shadowColor: '#A020F0',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  inputError: {
    borderColor: 'red',
  },
  error: {
    color: 'red',
    marginTop: -10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  button: {
    backgroundColor: '#A020F0',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#A020F0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    marginTop: 15,
  },
  secondaryButtonText: {
    color: '#A020F0',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
    textShadowColor: '#8A2BE2',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
