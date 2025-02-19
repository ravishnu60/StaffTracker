import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Modal, Portal, Text, TextInput, Provider, Menu } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { base_url } from '../utils/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Department options
const departments = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Marketing' },
    { id: 3, name: 'Human Resources' },
];

// Validation Schema
const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    addressingname: yup.string().required('Addressing Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    mobilenumber: yup.string()
        .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
        .required('Mobile number is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    departmentId: yup.string().required('Department is required'),
});

// Form Fields Configuration
const formFields = [
    { name: 'name', label: 'Full Name' },
    { name: 'addressingname', label: 'Addressing Name' },
    { name: 'email', label: 'Email', keyboardType: 'email-address' },
    { name: 'mobilenumber', label: 'Mobile Number', keyboardType: 'numeric' },
    { name: 'password', label: 'Password', secureTextEntry: true },
];

const AddUserModal = ({ visible, onDismiss }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const schema = yup.object().shape({
        name: yup.string().required('Name is required'),
        addressingname: yup.string().required('Addressing Name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        mobilenumber: yup.string().matches(/^\d{10}$/, 'Invalid mobile number').required('Mobile number is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        role: yup.number(),
        status: yup.boolean(),
        departmentId: yup.object().required('Department ID is required'),
    });
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            role: 2,
            status: true
        }
    });

    const onSubmit =async (data) => {
        let token= AsyncStorage.getItem('token')
        axios({
            method:'POST',
            url: base_url + 'staff/user/create',
            data: data,
            headers: {Authorization: token }
        }).then((res)=>{

        }).catch((err)=>{

        })
    };

    return (
        <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text style={{ textAlign: 'center', marginBottom: 20, fontSize: 20 }}>User Register</Text>
                {[
                    { name: 'name', label: 'Name' },
                    { name: 'addressingname', label: 'Addressing Name' },
                    { name: 'email', label: 'Email', keyboardType: 'email-address' },
                    { name: 'mobilenumber', label: 'Mobile Number', keyboardType: 'phone-pad' },
                    { name: 'password', label: 'Password', secureTextEntry: true },
                ].map(({ name, label, ...rest }) => (
                    <View key={name}>
                        <Controller
                            control={control}
                            name={name}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    label={label}
                                    value={value?.toString() || ''}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    error={!!errors[name]}
                                    {...rest}
                                />
                            )}
                        />
                        <Text style={{ color: 'red', marginBottom: 10 }}>{errors[name]?.message}</Text>
                    </View >

                ))}
                <Controller
                    control={control}
                    name='departmentId'
                    render={({ field: { onChange, value } }) =>
                        <Dropdown
                            data={departments}
                            style={{ padding: 10, backgroundColor: '#efe4f0', borderColor: '#675e67', borderBottomWidth: 1 }}
                            placeholder='Select Department'
                            valueField='id'
                            labelField='name'
                            value={value}
                            onChange={onChange}
                        />
                    }
                />
                <Text style={{ color: 'red', marginBottom: 10 }}>{errors?.departmentId?.message}</Text>

                <Button mode="contained" onPress={handleSubmit(onSubmit)} style={{ marginTop: 20 }}>
                    Register
                </Button>
            </ScrollView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        marginBottom: 5,
        backgroundColor: '#ffffff',
        fontSize: 14
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -5,
    },
    dropdown: {
        marginBottom: 10,
        justifyContent: 'center',
        alignSelf: 'stretch',
    },
    submitButton: {
        marginTop: 10,
    },
});

export { AddUserModal };
