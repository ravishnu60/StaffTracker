import React from 'react';
import { View, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextInput, Button, Text } from 'react-native-paper';

// Validation Schema
const schema = yup.object().shape({
  id: yup.number().required('ID is required'),
  name: yup.string().required('Name is required'),
  addressingname: yup.string().required('Addressing Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  mobilenumber: yup.string().matches(/^\d{10}$/, 'Invalid mobile number').required('Mobile number is required'),
  username: yup.string().required('Username is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: yup.string().required('Role is required'),
  permissions: yup.string().required('Permissions are required'),
  status: yup.boolean().required('Status is required'),
  departmentId: yup.number().required('Department ID is required'),
});

const Register = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text variant="headlineLarge" style={{ textAlign: 'center', marginBottom: 20 }}>Register</Text>
      {[
        { name: 'id', label: 'ID', keyboardType: 'numeric' },
        { name: 'name', label: 'Name' },
        { name: 'addressingname', label: 'Addressing Name' },
        { name: 'email', label: 'Email', keyboardType: 'email-address' },
        { name: 'mobilenumber', label: 'Mobile Number', keyboardType: 'phone-pad' },
        { name: 'username', label: 'Username' },
        { name: 'password', label: 'Password', secureTextEntry: true },
        { name: 'role', label: 'Role' },
        { name: 'permissions', label: 'Permissions' },
        { name: 'departmentId', label: 'Department ID', keyboardType: 'numeric' },
      ].map(({ name, label, ...rest }) => (
        <Controller
          key={name}
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={label}
              value={value?.toString() || ''}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors[name]}
              style={{ marginBottom: 10 }}
              {...rest}
            />
          )}
        />
      ))}
      <Controller
        control={control}
        name="status"
        render={({ field: { onChange, value } }) => (
          <Button mode={value ? 'contained' : 'outlined'} onPress={() => onChange(!value)}>
            {value ? 'Active' : 'Inactive'}
          </Button>
        )}
      />
      {Object.keys(errors).map((key) => (
        <Text key={key} style={{ color: 'red' }}>{errors[key]?.message}</Text>
      ))}
      <Button mode="contained" onPress={handleSubmit(onSubmit)} style={{ marginTop: 20 }}>
        Register
      </Button>
    </ScrollView>
  );
};

export default Register;
