import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { Alert, Button, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

function CustomHeader({ title }) {
    const navigation = useNavigation();
    const logout = () => {
        Alert.alert(
            'Logout',
            'Are you sure to logout?',
            [
                {
                    text: 'Cancel',
                    onPress: null
                },
                {
                    text: 'Logout',
                    onPress: async () => {
                        await AsyncStorage.removeItem('token');
                        navigation.navigate('Login');
                    }
                }
            ]
        )
    }

    return (
        <View style={styles.header}>
            <Text style={styles.headerText}>{title}</Text>
            <Button mode="contained" style={styles.headerButton} onPress={logout} title='Logout' />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#6200ee',
        padding: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerButton: {
        backgroundColor: '#fff',
        color: '#6200ee',
    },
})

export default CustomHeader;