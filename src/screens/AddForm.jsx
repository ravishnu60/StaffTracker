import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { TextInput, Button, HelperText, Title, useTheme } from 'react-native-paper';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const FormScreen = () => {
    const { colors } = useTheme();

    // React Hook Form
    const { control, handleSubmit, formState: { errors }, } = useForm({
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
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

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
        console.log('Form Data:', { date, ...data });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Title style={{ color: colors.primary }}>Form Input</Title>

            {/* Date Picker */}
            <Button mode="contained-tonal" style={{ marginVertical: 10, borderRadius: 10 }} onPress={showDatepicker}>
                Select Date: {date.toDateString()}
            </Button>
            {/* {showDatePicker && (
                <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
            )} */}

            {/* Form Fields with Validation */}
            {[
                { key: 'particulars', label: 'Particulars', rules: { required: 'Particulars are required' } },
                { key: 'unit', label: 'Unit', rules: { required: 'Unit is required' } },
                { key: 'lessons', label: 'Lessons', rules: { required: 'Lessons are required' } },
                { key: 'outcome', label: 'Outcome', rules: { required: 'Outcome is required' } },
                { key: 'hrs', label: 'Hours', keyboardType: 'numeric', rules: { required: 'Hours are required', pattern: { value: /^[0-9]+$/, message: 'Only numbers allowed' } } },
                { key: 'num', label: 'Number', keyboardType: 'numeric', rules: { required: 'Number is required', pattern: { value: /^[0-9]+$/, message: 'Only numbers allowed' } } },
                { key: 'status', label: 'Status', rules: { required: 'Status is required' } },
                { key: 'url', label: 'URL', rules: { required: 'URL is required', pattern: { value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/, message: 'Enter a valid URL' } } },
            ].map((field) => (
                <View key={field.key}>
                    <Controller
                        control={control}
                        name={field.key}
                        rules={field.rules}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                label={field.label}
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
                    {errors[field.key] && <HelperText type="error">{errors[field.key]?.message}</HelperText>}
                </View>
            ))}

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
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
    },
});

export default FormScreen;
