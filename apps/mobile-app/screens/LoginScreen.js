import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Title, Surface } from 'react-native-paper';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    // Simulate API call or processing
    console.log('Login Credentials:', { email, password });
    
    // Reset loading state after a short delay (or when actual logic completes)
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Surface style={styles.surface} elevation={2}>
        <Title style={styles.title}>Welcome Back</Title>
        <Text style={styles.subtitle}>Sign in to SFA Mobile</Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          left={<TextInput.Icon icon="email" />}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          mode="outlined"
          secureTextEntry
          style={styles.input}
          left={<TextInput.Icon icon="lock" />}
        />

        <Button 
          mode="contained" 
          onPress={handleLogin} 
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Login
        </Button>
      </Surface>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
    color: '#666',
  },
  input: {
    width: '100%',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    marginTop: 8,
    borderRadius: 4,
  },
  buttonContent: {
    paddingVertical: 6,
  },
});

export default LoginScreen;
