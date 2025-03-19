import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { TextInput, Button, HelperText, Title, useTheme } from 'react-native-paper';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axiosInstance from '../utils/axiosInstance';
import { dateStr, Loading } from '../utils/utils';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';


const outcomeData= [
    {label: 'Work Product', value: 'P' },
    {label: 'Service', value: 'S' },
    {label: 'Meeting', value: 'M' },
    {label: 'Personal related to Research, FDP', value: 'X' },
    {label: 'Training program', value: 'T' },
]


const FormScreen = ({ route }) => {
    const { colors } = useTheme();
    const navigation = useNavigation();

    // React Hook Form
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            particulars: '',
            unit: '',
            lessons: '',
            outcome: '',
            hrs: '',
            num: '',
            status: '',
            url: '',
        },
    });

    // Date Picker State
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

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

    // Submit function
    const onSubmit = (data) => {
        setLoading(true);

        axiosInstance({
            method: 'POST',
            url: 'staff/workdetails/create',
            data: { ...data, date: dateStr(date), outcome: data.outcome.value }
        }).then((res) => {
            if (res.data.status) {
                Alert.alert('Success', 'Work Details saved');
                navigation.navigate('Home');
            } else {
                Alert.alert('Error', 'Failed to save Work Details');
            }
        }).catch((err) => {
            console.log(err);
            Alert.alert('Error', 'Failed to save Work Details');
        }).finally(() => {
            setLoading(false);
        })

    };

    useEffect(() => {
        if (route.params) {
            reset(route.params || {});
            route.params.start && setDate(new Date(route.params.start));
        }
    }, [route.params]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Loading visible={loading} />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, columnGap: 15 }}>
                <FontAwesome name="arrow-left" size={25} color={'gray'} onPress={() => navigation.goBack()} />
                <Title style={{ color: colors.primary, fontWeight: 'bold', textAlign: 'center' }}>Work Details Form</Title>
                <View />
            </View>

            {/* Form Fields with Validation */}
            {[
                { key: 'project', label: 'Project *', rules: { required: 'Project is required' } },
                { key: 'particulars', label: 'Particulars *', rules: { required: 'Particulars are required' } },
                { key: 'unit', label: 'Unit', keyboardType: 'numeric', rules: { pattern: { value: /^[0-9]+$/, message: 'Only numbers allowed' } } },
                { key: 'lessons', label: 'Lessons', rules: { } },
                { key: 'hrs', label: 'Hours (Minutes) *', keyboardType: 'numeric', rules: { required: 'Hours are required', pattern: { value: /^[0-9]+$/, message: 'Only numbers allowed' } } },
                { key: 'num', label: 'Number', rules: { } }, //pattern: { value: /^[0-9]+$/, message: 'Only numbers allowed' }
                { key: 'status', label: 'Status *', rules: { required: 'Status is required' } },
                { key: 'url', label: 'URL', rules: { pattern: { value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/, message: 'Enter a valid URL' } } },
            ].map((field) => (
                <View key={field.key}>
                    <Controller
                        control={control}
                        name={field.key}
                        rules={field.rules}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                label={field.label}
                                placeholder={field.key === 'hrs' ? 'Enter in minutes' : ''}
                                placeholderTextColor={'#b5b5b5'}
                                value={value}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                keyboardType={field.keyboardType || 'default'}
                                mode="outlined"
                                style={styles.input}
                                error={!!errors[field.key]}
                            />
                        )}
                    />
                    {errors[field.key] && <HelperText style={{ paddingTop: 0 }} type="error">{errors[field.key]?.message}</HelperText>}
                </View>
            ))}

            {/* Dropdown */}
            <Controller
                control={control}
                name="outcome"
                rules={{ required: 'Outcome is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Dropdown
                        data={outcomeData}
                        labelField={"label"}
                        valueField={"value"}
                        placeholder="Select Outcome *"
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        mode="outlined"
                        style={[styles.dropdown, errors.outcome ? { borderColor: '#9f0d0d', borderWidth: 2 } : null]}
                        
                    />
                )}
            />
            {errors.outcome && <HelperText style={{ paddingTop: 0 }} type="error">{errors.outcome?.message}</HelperText>}

            {/* Date Picker */}
            <Button style={{ marginVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.primary }} onPress={showDatepicker}>
                {date.toDateString()}
            </Button>
            {/* {showDatePicker && (
                <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
            )} */}

            {/* Submit Button */}
            <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
                Submit
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        // paddingTop: 10,
        // justifyContent: 'center',
    },
    input: {
        marginTop: 10,
    },
    button: {
        marginTop: 10,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginTop: 15,
        padding: 15
    }
});

export default FormScreen;
