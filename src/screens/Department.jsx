import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Button, Modal, Text, TextInput, DataTable, IconButton } from 'react-native-paper';
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

const columns = ["Name", 'Actions'];

const Department = ({ navigation }) => {

    const schema = yup.object().shape({
        name: yup.string().required('Name is required')
    });
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: null
        }
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [mode, setMode] = useState('Add');

    const openModal = () => setModalVisible(true);
    const closeModal = () => {
        reset({});
        setModalVisible(false);
    }

    const deleteUser = (id) => {
        Alert.alert('Are you sure to delete ?', '', [
            {
                text: 'Cancel',
                onPress: null
            },
            {
                text: 'Delete',
                onPress: () => {
                    Alert.alert('Department deleted!')
                }
            }
        ])
    }

    const onSubmit = async (data) => {
        let token = AsyncStorage.getItem('token')
        axios({
            method: 'POST',
            url: base_url + 'staff/user/create',
            data: data,
            headers: { Authorization: token }
        }).then((res) => {

        }).catch((err) => {

        })
    };

    return (
        <View style={styles.container}>
            {/* Add Button */}
            <View style={styles.addButtonContainer}>
                <TouchableOpacity onPress={openModal} style={styles.addButton}>
                    <Text style={styles.addButtonLabel}>{mode} Department</Text>
                </TouchableOpacity>
            </View>

            {/* Table */}
            <DataTable>
                <DataTable.Header>
                    {columns.map((column) => (
                        <DataTable.Title key={column} style={{ flex: column === 'Actions' ? 1 : column === 'Email' ? 3 : 2, paddingLeft: 5 }}>
                            <Text style={styles.tableHeader}>{column}</Text>
                        </DataTable.Title>
                    ))}
                </DataTable.Header>

                <FlatList
                    data={departments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <>
                            <DataTable.Row>
                                <DataTable.Cell style={{ flex: 2 }}><Text style={styles.tableCell} numberOfLines={1}>{item.name}</Text></DataTable.Cell>
                                <DataTable.Cell style={{ flex: 1 }}>
                                    <View style={styles.actionContainer}>
                                        <IconButton icon="eye" iconColor='#18a6d9' size={20} onPress={() => { reset(item); setMode('View'); setModalVisible(true) }} />
                                        <IconButton icon="pencil" iconColor='#01ac24' size={20} onPress={() => { reset(item); setMode('Edit'); setModalVisible(true); }} />
                                        <IconButton icon="delete" iconColor='#ff5959' size={20} onPress={() => deleteUser(item?.id)} />
                                    </View>
                                </DataTable.Cell>
                            </DataTable.Row>
                        </>
                    )}
                />
            </DataTable>

            <Modal visible={modalVisible} onDismiss={closeModal} contentContainerStyle={styles.modal}>
                <ScrollView contentContainerStyle={{ padding: 10 }}>
                    <Text style={{ textAlign: 'center', marginBottom: 20, fontSize: 20 }}>{mode} Department</Text>
                    {[
                        { name: 'name', label: 'Name' }
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
                                        style={styles.input}
                                        {...rest}
                                        readOnly={mode === 'View'}
                                    />
                                )}
                            />
                            <Text style={{ color: 'red', marginBottom: 10 }}>{errors[name]?.message}</Text>
                        </View >

                    ))}
                    
                    <Text style={{ color: 'red', marginBottom: 10 }}>{errors?.departmentId?.message}</Text>
                    <View style={{ flexDirection: 'row', columnGap: 20, alignItems: 'center', justifyContent: 'center' }}>
                        <Button mode="contained-tonal" contentStyle={{ backgroundColor: '#f76666' }} labelStyle={{ color: '#fff' }} onPress={closeModal} >Close </Button>
                        {mode !== 'View' && <Button mode="contained" onPress={handleSubmit(onSubmit)} > {mode} </Button>}
                    </View>
                </ScrollView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f4f4f4',
    },
    addButtonContainer: {
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#6200ee',
        borderRadius: 5,
    },
    addButtonLabel: {
        color: '#fff',
        padding: 10,
        fontSize: 14,
        fontWeight: 'bold',
    },


    tableHeader: {
        fontWeight: 'bold',
        color: '#333',
    },
    tableCell: {
        color: '#333',
        fontSize: 12,
        paddingRight: 15,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 5,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    modal: {
        backgroundColor: 'white',
        padding: 10,
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
        backgroundColor: '#f5f5f5',
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
        padding: 10,
        borderColor: '#675e67',
        borderBottomWidth: 0.8
    },
    submitButton: {
        marginTop: 10,
    },
});

export default Department;
