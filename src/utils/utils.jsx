import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export const base_url = "https://rbdsxt4c-9094.inc1.devtunnels.ms/";

export const Loading = ({ visible }) => {
    return (
        visible && <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Loading...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    loaderContainer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", backgroundColor: "#cecece2f", zIndex: 1 },
    loadingText: { marginTop: 10, fontSize: 16, color: "#555" },
})

export const dateStr = (dateObj) => dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);

export const getMonthStartAndEnd = (date) => {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1); // First day of the month
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0); // Last day of the month

    return {
        startDate: startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        endDate: endDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
    };
}