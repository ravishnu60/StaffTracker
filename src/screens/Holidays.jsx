import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Button, Modal, Text, TextInput, DataTable, IconButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loading } from '../utils/utils';
import { useIsFocused } from '@react-navigation/native';
import axiosInstance from '../utils/axiosInstance';

const columns = ["Date", 'type'];

const sampleData= [
    { id: 1, date: '2022-01-01', type: 'Holiday' },
    { id: 2, date: '2022-01-26', type: 'Half day' },
]

const Holidays = ({ navigation }) => {
    const schema = yup.object().shape({
        departmentName: yup.string().required('Name is required')
    });
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            departmentName: null
        }
    });

    const isFocused = useIsFocused();
    const [departmentList, setDepartmentList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [mode, setMode] = useState('Add');

    const openModal = () => setModalVisible(true);
    const closeModal = () => {
        reset({});
        setModalVisible(false);
    }

    const getDepartments = () => {
        setLoading(true);
        axiosInstance({
            method: 'GET',
            url: 'staff/department/findAll'
        }).then((res) => {
            if (res.data.status) {
                setDepartmentList(res.data.responseDto?.departments);
            } else {
                Alert.alert('Error', 'Failed to get department list');
            }
        }).catch((err) => {
            console.log(err);
            Alert.alert('Error', 'Failed to get department list');
        }).finally(() => {
            setLoading(false);
        })
    }

    const createDepartment = (data) => {
        setLoading(true);
        axiosInstance({
            method: 'POST',
            url: 'staff/department/createdept',
            data: data
        }).then((res) => {
            if (res.data.status) {
                getDepartments();
                closeModal();
                Alert.alert('Success', mode === 'Add' ? 'Department created successfully' : 'Department updated successfully');
            } else {
                Alert.alert('Error', mode === 'Add' ? 'Failed to create department' : 'Failed to update department');
            }
        }).catch((err) => {
            console.log(err);
            Alert.alert('Error', mode === 'Add' ? 'Failed to create department' : 'Failed to update department');
        }).finally(() => {
            setLoading(false);
        })
    }

    const deleteDepartment = (id) => {
        Alert.alert('Are you sure to delete ?', '', [
            {
                text: 'Cancel',
                onPress: null
            },
            {
                text: 'Delete',
                onPress: () => {
                    setLoading(true);
                    axiosInstance.delete(`staff/department/delete/${id}`).then((res) => {
                        if (res.data.status) {
                            getDepartments();
                            Alert.alert('Department deleted!')
                        } else {
                            Alert.alert('Error', 'Failed to delete department');
                        }
                    }).catch((err) => {
                        console.log(err);
                        Alert.alert('Error', 'Failed to delete department');
                    }).finally(() => {
                        setLoading(false);
                    })
                }
            }
        ])
    }

    useEffect(() => {
        if (isFocused) {
            getDepartments();
        }
    }, [isFocused]);

    return (
        <View style={styles.container}>
            <Loading visible={loading} />
            {/* Add Button */}
            <View style={styles.addButtonContainer}>
                <TouchableOpacity onPress={() => {
                    openModal();
                    setMode('Add');
                    reset({});
                }} style={styles.addButton}>
                    <Text style={styles.addButtonLabel}>Add Holiday</Text>
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
                    data={sampleData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <>
                            <DataTable.Row>
                                <DataTable.Cell style={{ flex: 2 }}><Text style={styles.tableCell} numberOfLines={1}>{item.date}</Text></DataTable.Cell>
                                <DataTable.Cell style={{ flex: 2 }}><Text style={styles.tableCell} numberOfLines={1}>{item.type}</Text></DataTable.Cell>
                            </DataTable.Row>
                        </>
                    )}
                />
            </DataTable>

            <Modal visible={modalVisible} onDismiss={closeModal} contentContainerStyle={styles.modal}>
                <ScrollView contentContainerStyle={{ padding: 10 }}>
                    <Text style={{ textAlign: 'center', marginBottom: 20, fontSize: 20 }}>{mode} Department</Text>
                    {[
                        { name: 'departmentName', label: 'Name' }
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
                        {mode !== 'View' && <Button mode="contained" onPress={handleSubmit(createDepartment)} > {mode} </Button>}
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

export default Holidays;
