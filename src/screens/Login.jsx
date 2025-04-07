import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, Alert, ImageBackground, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextInput, Button, Text, Checkbox } from 'react-native-paper';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axiosInstance from '../utils/axiosInstance';
import { Loading } from '../utils/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContextData } from '../navigations/MainNavigation';


const Login = () => {
  const navigate = useNavigation();
  const isFocused = useIsFocused();
  const contextVal = useContext(ContextData);

  // loading
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  // Validation Schema
  const schema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    remember: yup.boolean(),
  });
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema), defaultValues: {
      username: '',
      password: '',
      remember: false
    }
  });

  const patchValueIfExist = async () => {
    const username = await AsyncStorage.getItem('username');
    const password = await AsyncStorage.getItem('password');
    if (username && password) {
      reset({
        username: username,
        password: password,
        remember: true
      });
    }
  }

  const onSubmit = (data) => {
    console.log(data);

    if (data.remember) {
      AsyncStorage.setItem('username', data.username);
      AsyncStorage.setItem('password', data.password);
    } else {
      AsyncStorage.removeItem('username');
      AsyncStorage.removeItem('password');
    }

    setLoading(true);
    axiosInstance({
      method: 'POST',
      url: 'staff/auth/login',
      data: { username: data.username, password: data.password }
    }).then((res) => {
      if (res.data.status) {
        AsyncStorage.setItem('token', res.data.response.Authorization);
        contextVal.setUser(res.data.response);
        if (res.data?.response?.roleName === "ADMIN") {
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
      patchValueIfExist();
    }
  }, [isFocused])

  return (
    <ImageBackground source={require('../assets/login_bg.png')} style={{ flex: 1 }} resizeMode='stretch'>
      <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1, marginTop: 100, justifyContent: 'center' }} >
        <Loading visible={loading} />
        <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
          <Text variant="titleLarge" style={{ textAlign: 'center', marginBottom: 20, fontWeight: 'bold' }}>Login</Text>
          {[
            { name: 'username', label: 'Email ID' },
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

          {/* password */}
          <View style={{ marginBottom: 10 }}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label={"Password"}
                  value={value || ''}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={!!errors['password']}
                  secureTextEntry={!show}
                />
              )}
            />
            <TouchableOpacity onPress={() => setShow(!show)} style={{position:'absolute', right: 0, top: 3, padding: 15}}>
              <Icon name={show ? "eye-off" : "eye"} size={24} color="#888" />
            </TouchableOpacity>

            <Text style={{ color: 'red' }}>{errors['password']?.message}</Text>
          </View>
          {/* check box for remember me */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Controller
              control={control}
              name="remember"
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  status={value ? 'checked' : 'unchecked'}
                  onPress={() => onChange(!value)}
                />
              )}
            />
            <Text style={{ marginLeft: 10 }}>Remember Me</Text>
          </View>
          <Button mode="contained" onPress={handleSubmit(onSubmit)} style={{ marginTop: 20 }}>
            Login
          </Button>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Login;
