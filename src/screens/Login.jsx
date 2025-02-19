import React, { useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextInput, Button, Text } from 'react-native-paper';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { base_url } from '../utils/utils';


const Login = () => {
  const navigate = useNavigation();
  const isFocused = useIsFocused();

  // Validation Schema
  const schema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    navigate.navigate('Admin')

    axios({
      method: 'POST',
      url: base_url + 'staff/auth/login',
      data: data
    }).then((res) => {
      if (res.data?.role?.id === 1) {
        navigate.navigate('Admin')
      } else {
        navigate.navigate('Home')
      }
    }).catch((err) => {
      console.log(err);
      Alert.alert('Error', 'Invalid username or password');
    })
  };

  useEffect(() => {
    if (isFocused) {
      reset();
    }
  }, [isFocused])

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text variant="headlineLarge" style={{ textAlign: 'center', marginBottom: 20 }}>Login</Text>
      {[
        { name: 'username', label: 'Username' },
        { name: 'password', label: 'Password', secureTextEntry: true },
      ].map(({ name, label, ...rest }) => (
        <View key={name} style={{ marginBottom: 10 }}>
          <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label={label}
                value={value || ''}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors[name]}
                {...rest}
              />
            )}
          />

          <Text style={{ color: 'red' }}>{errors[name]?.message}</Text>
        </View>
      ))}
      <Button mode="contained" onPress={handleSubmit(onSubmit)} style={{ marginTop: 20 }}>
        Login
      </Button>
    </ScrollView>
  );
};

export default Login;
