import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Button, Modal, Text, TextInput, DataTable, IconButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { dateStr, Loading } from '../utils/utils';
import { useIsFocused } from '@react-navigation/native';
import axiosInstance from '../utils/axiosInstance';

const columns = ["Date", 'type'];

const sampleData = [
    { id: 1, date: '2022-01-01', type: 'Holiday' },
    { id: 2, date: '2022-01-26', type: 'Half day' },
]

const Holidays = ({ navigation }) => {

    const schema = yup.object().shape({
        type: yup.object().required('Type is required'),
    });
    const { control, handleSubmit, setValue, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { type: null }
    });

    const types = [
        { label: 'Holiday', value: 'Holiday' },
        { label: 'Half day', value: 'Halfday' }
    ]

    const isFocused = useIsFocused();
    const [holidayList, setHolidayList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [mode, setMode] = useState('Add');
    const [date, setDate] = useState(new Date());


    const openModal = () => {
        setModalVisible(true);
    }
    const closeModal = () => {
        reset({});
        setModalVisible(false);
    }

    const getHolidays = () => {
        setLoading(true);
        axiosInstance({
            method: 'GET',
            url: 'staff/holiday/getAll'
        }).then((res) => {
            if (res.data.status) {
                setHolidayList(res.data?.responseDto.holidays);
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

    console.log("error", errors);

    const createHoliday = (data) => {
        let temp = { date: dateStr(date), type: data.type.value }

        if (mode === 'Edit') 
            temp.id = data.id
        console.log("temp", temp);
        
        setLoading(true);
        axiosInstance({
            method: 'POST',
            url: 'staff/holiday/create',
            data: temp
        }).then((res) => {
            console.log(res.data);
            
            if (res.data.status) {
                getHolidays();
                closeModal();
                Alert.alert('Success', mode === 'Add' ? 'Holiday created successfully' : 'Holiday updated successfully');
            } else {
                Alert.alert('Error', mode === 'Add' ?  res.data.information?.message : 'Failed to update Holiday');
            }
        }).catch((err) => {
            console.log("err", err);
            Alert.alert('Error', mode === 'Add' ? 'Failed to create Holiday' : 'Failed to update Holiday');
        }).finally(() => {
            setLoading(false);
        })
    }

    const deleteHoliday = (id) => {
        Alert.alert('Are you sure to delete ?', '', [
            {
                text: 'Cancel',
                onPress: null
            },
            {
                text: 'Delete',
                onPress: () => {
                    setLoading(true);
                    axiosInstance.delete(`staff/holiday/delete/${id}`).then((res) => {                      
                        if (res.data.status) {
                            getHolidays();
                            Alert.alert('Holiday deleted!')
                        } else {
                            Alert.alert('Error', 'Failed to delete Holiday');
                        }
                    }).catch((err) => {
                        console.log(err);
                        Alert.alert('Error', 'Failed to delete Holiday');
                    }).finally(() => {
                        setLoading(false);
                    })
                }
            }
        ])
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };
    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showDatepicker = () => {
        showMode('date');
    };

    useEffect(() => {
        if (isFocused) {
            getHolidays();
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
                    data={holidayList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <>
                            <DataTable.Row>
                                <DataTable.Cell style={{ flex: 2 }}><Text style={styles.tableCell} numberOfLines={1}>{dateStr(new Date(item.date))}</Text></DataTable.Cell>
                                <DataTable.Cell style={{ flex: 2 }}><Text style={styles.tableCell} numberOfLines={1}>{item.type}</Text></DataTable.Cell>
                                <DataTable.Cell style={{ flex: 1 }}>
                                    <View style={styles.actionContainer}>
                                        <IconButton icon="pencil" iconColor='#01ac24' size={20} onPress={() => { reset({...item, type: types.find((e) => e.value === item.type)}); setMode('Edit'); setModalVisible(true); }} />
                                        <IconButton icon="delete" iconColor='#ff5959' size={20} onPress={() => deleteHoliday(item?.id)} />
                                    </View>
                                </DataTable.Cell>
                            </DataTable.Row>
                        </>
                    )}
                />
                {loading === false && holidayList.length === 0 && <Text style={{ textAlign: 'center', marginTop: 20 }}>No data found</Text>}
            </DataTable>

            <Modal visible={modalVisible} onDismiss={closeModal} contentContainerStyle={styles.modal}>
                <ScrollView contentContainerStyle={{ padding: 10 }}>
                    <Text style={{ textAlign: 'center', marginBottom: 20, fontSize: 20 }}>{mode} Holiday</Text>

                    <View>
                        <Controller
                            control={control}
                            name='type'
                            render={({ field: { onChange, value } }) =>
                                <Dropdown
                                    data={types}
                                    style={[styles.input, styles.dropdown]}
                                    placeholder='Select Type'
                                    valueField='value'
                                    labelField='label'
                                    value={value}
                                    onChange={onChange}
                                    disable={mode === 'View'}
                                />
                            }
                        />
                        <Text style={{ color: 'red', marginBottom: 10 }}>{errors?.type?.message}</Text>
                    </View >

                    <Text style={{}}>Select Date</Text>
                    <Button mode="contained-tonal" style={{ marginVertical: 10, borderRadius: 10, marginBottom: 20 }} onPress={showDatepicker}>
                        {date.toDateString()}
                    </Button>
                    <View style={{ flexDirection: 'row', columnGap: 20, alignItems: 'center', justifyContent: 'center' }}>
                        <Button mode="contained-tonal" contentStyle={{ backgroundColor: '#f76666' }} labelStyle={{ color: '#fff' }} onPress={closeModal} >Close </Button>
                        {mode !== 'View' && <Button mode="contained" onPress={handleSubmit(createHoliday)} > {mode} </Button>}
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
