import { StyleSheet, Text, ToastAndroid, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
const RNFS = require('react-native-fs');
import XLSX from 'xlsx';

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
    const startDate = new Date(date.getFullYear(), date.getMonth(), 2); // First day of the month
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1); // Last day of the month

    return {
        startDate: startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        endDate: endDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
    };
}

const monthName = {
    "0": "Jan", "1": "Feb", "2": "Mar", "3": "Apr", "4": "May", "5": "Jun", "6": "Jul", "7": "Aug", "8": "Sep", "9": "Oct", "10": "Nov", "11": "Dec"
}

// function to handle writing and downloading excel file
export const writeDataAndDownloadExcelFile = (data, user, setLoading, fromMonthIndex, toMonthIndex) => {
    setLoading(true);
    let data_to_export = data.map((item, index) => {
        return { "S.No": index + 1, "Date": dateStr(item.start), "Project": item.project, "Particulars": item.particulars, "Unit": item.unit, "Lesson": item.lessons, "Outcome": item.outcome, "Hrs": item.hrs, "Num": item.num, "Status": item.status, "Link": item.url }
    })

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(data_to_export)
    XLSX.utils.book_append_sheet(wb, ws, user ? user : "Users")
    const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });

    // Write generated excel to Storage
    RNFS.writeFile(RNFS.DownloadDirectoryPath + `/CA-DAR-${monthName[fromMonthIndex].toUpperCase()}-${monthName[toMonthIndex].toUpperCase()}.xlsx`, wbout, 'ascii').then((r) => {
        ToastAndroid.showWithGravity(
            'File Downloaded Successfully, Check Download Folder',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
        );
    }).catch((e) => {
        console.log('Error', e);
        ToastAndroid.showWithGravity(
            'File Download Failed',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
        )
    }).finally(() => {
        setLoading(false);
    })

}

export const HODDownloadExcelFile = (data, setLoading, fromMonthIndex, toMonthIndex) => {
    setLoading(true);
    let wb = XLSX.utils.book_new();
    data.forEach((item, index) => {
        let ws = XLSX.utils.json_to_sheet(item.workingDetails)
        XLSX.utils.book_append_sheet(wb, ws, item.addressingname)
    })

    const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });

    // Write generated excel to Storage
    RNFS.writeFile(RNFS.DownloadDirectoryPath + `/CA-DAR-ALL-${monthName[fromMonthIndex].toUpperCase()}-${monthName[toMonthIndex].toUpperCase()}.xlsx`, wbout, 'ascii').then((r) => {
        ToastAndroid.showWithGravity(
            'File Downloaded Successfully, Check Download Folder',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
        );
    }).catch((e) => {
        console.log('Error', e);
        ToastAndroid.showWithGravity(
            'File Download Failed',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
        )
    }).finally(() => {
        setLoading(false);
    })

}