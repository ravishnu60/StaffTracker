import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextInput, Button, Text } from 'react-native-paper';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axiosInstance from '../utils/axiosInstance';
import { Loading } from '../utils/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = () => {
  const navigate = useNavigation();
  const isFocused = useIsFocused();

  // loading
  const [loading, setLoading] = useState(false);

  // Validation Schema
  const schema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    setLoading(true);
    axiosInstance({
      method: 'POST',
      url: 'staff/auth/login',
      data: data
    }).then((res) => {
      console.log(res.data);
      if (res.data.status) {
        AsyncStorage.setItem('token', res.data.response.Authorization);
        if (res.data?.response?.rights === "All") {
          navigate.navigate('Admin')
        } else {
          navigate.navigate('Home')
        }
      } else {
        Alert.alert('Error', 'Invalid username or password');
      }

    }).catch((err) => {
      console.log(err);
      Alert.alert('Error', 'Invalid username or password');
    }).finally(() => {
      setLoading(false);
    })
  };

  useEffect(() => {
    if (isFocused) {
      reset();
    }
  }, [isFocused])

  return (
    <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1, justifyContent: 'center' }} >
      <Loading visible={loading} />
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
