import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Button, Modal, Text, TextInput, DataTable, IconButton } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dropdown } from 'react-native-element-dropdown';
import { Loading } from '../utils/utils';
import { useIsFocused } from '@react-navigation/native';
import axiosInstance from '../utils/axiosInstance';

const columns = ["Name", 'Email', 'Dept', 'Role', 'Actions'];

const User = ({ navigation, route }) => {
    const schema = yup.object().shape({
        name: yup.string().required('Name is required'),
        addressingname: yup.string().required('Addressing Name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        mobilenumber: yup.string().matches(/^\d{10}$/, 'Invalid mobile number').required('Mobile number is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        roleId: yup.number(),
        status: yup.boolean(),
        departmentId: yup.object().required('Department ID is required'),
    });
    const { control, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            role: 2,
            status: true,
        }
    });

    const isFocused = useIsFocused();
    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [mode, setMode] = useState('Add');
    const [expandedRow, setExpandedRow] = useState(null);

    const openModal = () => {
        if (route?.params?.departmantName) {
            let find = departments.filter(item => item.departmentName === route?.params?.departmantName);
            if (find.length > 0) {
                setValue('departmentId', { id: find[0].id, departmentName: find[0].departmentName }, { shouldValidate: true });
            }
        }
        setModalVisible(true);
    }
    const closeModal = () => {
        reset({});
        setModalVisible(false);
    }

    const toggleExpand = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const getUsers = () => {
        setLoading(true);
        const url = route?.params?.type === 'HOD' ? 'staff/user/getDeparmentUsers' : 'staff/user/findAll'
        axiosInstance.get(url).then((res) => {
            if (res.data.status) {
                setUserList(res.data.responseDto?.userInfos || []);
            } else {
                Alert.alert('Error', 'Failed to get user list');
            }
        }).catch((err) => {
            console.log(err);
            Alert.alert('Error', 'Failed to get user list');
        }).finally(() => {
            setLoading(false);
        })
    }

    const department = watch('departmentId');
    const getDepartments = () => {
        axiosInstance({
            method: 'GET',
            url: 'staff/department/findAll'
        }).then((res) => {
            if (res.data.status) {
                setDepartments(res.data.responseDto?.departments);
            } else {
                Alert.alert('Error', 'Failed to get department list');
            }
        }).catch((err) => {
            console.log(err);
            Alert.alert('Error', 'Failed to get department list');
        })
    }

    const getRoles = () => {
        axiosInstance({
            method: 'GET',
            url: 'staff/role/findAllRole'
        }).then((res) => {
            if (res.data.status) {
                setRoles(res.data.responseDto?.roles);
            } else {
                Alert.alert('Error', 'Failed to get role list');
            }
        }).catch((err) => {
            console.log(err);
            Alert.alert('Error', 'Failed to get role list');
        })
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
                    setLoading(true);
                    axiosInstance.delete(`staff/user/delete/${id}`).then((res) => {
                        if (res.data.status) {
                            getUsers();
                            Alert.alert('User deleted!')
                        } else {
                            Alert.alert('Error', 'Failed to delete user');
                        }
                    }).catch((err) => {
                        console.log(err);
                        Alert.alert('Error', 'Failed to delete user');
                    }).finally(() => {
                        setLoading(false);
                    })
                }
            }
        ])
    }

    const onSubmit = async (data) => {
        setLoading(true);
        let temp = {
            name: data.name,
            addressingname: data.addressingname,
            email: data.email,
            mobilenumber: data.mobilenumber,
            password: data.password,
            status: data.status,
            roleId: data.roleId,
            departmentId: data.departmentId.id
        };
        if (mode === 'Edit') {
            temp.id = data.id
        }
        temp.departmentId = data.departmentId.id
        if (route?.params?.type === 'HOD') {
            temp.roleId = roles.find(role => role.role === 'STAFF').id
        } else {
            temp.roleId = roles.find(role => role.role === 'HOD').id
        }
        axiosInstance({
            method: 'POST',
            url: 'staff/user/create',
            data: temp
        }).then((res) => {
            if (res.data.status) {
                getUsers();
                closeModal();
                Alert.alert('Success', mode === 'Add' ? 'User created successfully' : 'User updated successfully');
            } else {
                Alert.alert('Error', mode === 'Add' ? 'Failed to create user' : 'Failed to update user');
            }
        }).catch((err) => {
            console.log(err);
            Alert.alert('Error', mode === 'Add' ? 'Failed to create user' : 'Failed to update user');
        }).finally(() => {
            setLoading(false);
        })
    };

    useEffect(() => {
        if (isFocused) {
            getUsers();
            getDepartments();
            getRoles();
        }
    }, [isFocused])

    return (
        <View style={styles.container}>
            <Loading visible={loading} />
            {/* Add Button */}
            <View style={[styles.addButtonContainer, route?.params?.type === 'HOD' && { justifyContent: 'space-between' }]}>
                {
                    route?.params?.type === 'HOD' && <>
                        <FontAwesome name="arrow-left" size={25} color="gray" onPress={() => navigation.goBack()} />
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Users</Text></>
                }
                <TouchableOpacity onPress={() => {
                    setMode('Add');
                    reset({});
                    openModal();
                }} style={styles.addButton}>
                    <Text style={styles.addButtonLabel}>Add User</Text>
                </TouchableOpacity>
            </View>

            {/* Table */}
            <DataTable>
                <DataTable.Header>
                    {columns.map((column) => (
                        <DataTable.Title key={column} style={{ flex: column === 'Actions' ? 1 : column === 'email' ? 3 : 2, paddingLeft: 5 }}>
                            <Text style={styles.tableHeader}>{column}</Text>
                        </DataTable.Title>
                    ))}
                </DataTable.Header>

                <FlatList
                    data={userList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <>
                            <DataTable.Row onPress={() => toggleExpand(item.id)}>
                                <DataTable.Cell style={{ flex: 2 }}><Text style={styles.tableCell} numberOfLines={1}>{item.name}</Text></DataTable.Cell>
                                <DataTable.Cell style={{ flex: 3 }}><Text style={styles.tableCell} numberOfLines={1}>{item.email}</Text></DataTable.Cell>
                                <DataTable.Cell style={{ flex: 2 }}><Text style={styles.tableCell} numberOfLines={1}>{item.department?.departmentName || 'N/A'}</Text></DataTable.Cell>
                                <DataTable.Cell style={{ flex: 2 }}><Text style={styles.tableCell} numberOfLines={1}>{item.role.role}</Text></DataTable.Cell>
                                <DataTable.Cell style={{ flex: 1 }}>
                                    <IconButton icon={expandedRow === item.id ? "chevron-up" : "chevron-down"} iconColor='#000' size={20} onPress={() => toggleExpand(item.id)} />
                                </DataTable.Cell>
                            </DataTable.Row>

                            {expandedRow === item.id && (
                                <View style={[styles.actionContainer, { backgroundColor: '#e9e9e9' }]}>
                                    <IconButton icon="eye" iconColor='#18a6d9' size={20} onPress={() => { reset({ ...item, departmentId: item.department }); setMode('View'); setModalVisible(true) }} />
                                    <IconButton icon="pencil" iconColor='#01ac24' size={20} onPress={() => { reset({ ...item, departmentId: item.department, roleId: item.role.id }); setMode('Edit'); setModalVisible(true); }} />
                                    <IconButton icon="delete" iconColor='#ff5959' size={20} onPress={() => deleteUser(item?.id)} />
                                </View>
                            )}
                        </>
                    )}
                />
            </DataTable>

            {
                loading === false && userList?.length === 0 &&
                <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>No data found</Text>
                </View>
            }

            <Modal visible={modalVisible} onDismiss={closeModal} contentContainerStyle={styles.modal}>
                <ScrollView contentContainerStyle={{ padding: 10 }}>
                    <Text style={{ textAlign: 'center', marginBottom: 20, fontSize: 20 }}>{mode} User</Text>
                    {[
                        { name: 'name', label: 'Name' },
                        { name: 'addressingname', label: 'Addressing Name' },
                        { name: 'email', label: 'Email', keyboardType: 'email-address' },
                        { name: 'mobilenumber', label: 'Mobile Number', keyboardType: 'phone-pad' },
                        { name: 'password', label: 'Password', secureTextEntry: true },
                    ].filter((field) => mode === 'Add' ? true : field.name !== 'password').map(({ name, label, ...rest }) => (
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
                    {route?.params?.type !== 'HOD' &&
                        <>
                            <Controller
                                control={control}
                                name='departmentId'
                                render={({ field: { onChange, value } }) =>
                                    <Dropdown
                                        data={departments}
                                        style={[styles.input, styles.dropdown]}
                                        placeholder='Select Department'
                                        valueField='id'
                                        labelField='departmentName'
                                        value={value}
                                        onChange={onChange}
                                        disable={mode === 'View'}
                                    />
                                }
                            />
                            <Text style={{ color: 'red', marginBottom: 10 }}>{errors?.departmentId?.message}</Text>
                        </>
                    }
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
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 10,
        padding: 5
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

    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        fontSize: 16,
        color: '#666',
    },
});

export default User;
