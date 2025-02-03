import React from 'react';
import { View, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextInput, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// Validation Schema
const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Login = () => {
  const navigate= useNavigation();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    navigate.navigate('Home')
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text variant="headlineLarge" style={{ textAlign: 'center', marginBottom: 20 }}>Login</Text>
      {[
        { name: 'username', label: 'Username' },
        { name: 'password', label: 'Password', secureTextEntry: true },
      ].map(({ name, label, ...rest }) => (
        <Controller
          key={name}
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={label}
              value={value || ''}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors[name]}
              style={{ marginBottom: 10 }}
              {...rest}
            />
          )}
        />
      ))}
      {Object.keys(errors).map((key) => (
        <Text key={key} style={{ color: 'red' }}>{errors[key]?.message}</Text>
      ))}
      <Button mode="contained" onPress={handleSubmit(onSubmit)} style={{ marginTop: 20 }}>
        Login
      </Button>
      <Button mode="contained" onPress={()=> navigate.navigate('Register') } style={{ marginTop: 20 }}>
        Register
      </Button>
    </ScrollView>
  );
};

export default Login;
