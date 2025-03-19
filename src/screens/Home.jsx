import React, { useContext, useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import { Button, Text } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons'; Ionicons
import axiosInstance from '../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContextData } from '../navigations/MainNavigation';
import { dateStr, getMonthStartAndEnd, Loading, writeDataAndDownloadExcelFile } from '../utils/utils';

function Home({ navigation }) {
  const [selDate, setSelDate] = useState(new Date());
  const contextVal = useContext(ContextData);
  const events = [
    { start: new Date('2025-03-14'), end: new Date('2025-03-14'), unit: 'Math', lesson: 'Algebra', status: 'Completed' },
    { start: new Date('2025-03-14'), end: new Date('2025-03-14'), unit: 'Math', lesson: 'Algebra', status: 'Completed' },
    { start: new Date('2025-03-14'), end: new Date('2025-03-14'), unit: 'Math', lesson: 'Algebra', status: 'Completed' },
    { start: new Date('2025-03-14'), end: new Date('2025-03-14'), unit: 'Math', lesson: 'Algebra', status: 'Completed' },
    { start: new Date('2025-03-14'), end: new Date('2025-03-14'), unit: 'Math', lesson: 'Algebra', status: 'Completed' },
    // { start: new Date('2025-02-15'), unit: 'Science', lesson: 'Physics', status: 'Pending' },
    // { start: new Date('2025-02-14'), unit: 'English', lesson: 'Grammar', status: 'Completed' },
    // { start: new Date('2025-02-17'), unit: 'History', lesson: 'World War II', status: 'Ongoing' },
    // { start: new Date('2025-02-18'), unit: 'Chemistry', lesson: 'Organic', status: 'Completed' },
  ];
  const [eventsList, setEventsList] = useState([]);
  const [selEvents, setSelEvents] = useState([]);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [menu, setMenu] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDownload, setShowDownload] = useState(false);

  const selectedDate = (date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  }

  const RenderEvent = (e) => {
    return (
      <View style={{ width: 4, height: 4, borderRadius: 100, backgroundColor: 'red' }} />
    )
  }

  const getRoleName = async () => {
    const role = await AsyncStorage.getItem('role');
    setRole(role);
  }

  const getWorkDetails = () => {
    setLoading(true);
    const dates = getMonthStartAndEnd(selDate);

    axiosInstance({
      method: 'GET',
      url: `staff/workdetails/userListByDate/${dates.startDate}/${dates.endDate}`
    }).then((res) => {
      if (res.data.status) {
        let temp = res.data?.responseDto.workingDetailsList.map(w => ({
          start: new Date(w.date),
          end: new Date(w.date),
          project: w.project,
          particulars: w.particulars,
          unit: w.unit,
          lessons: w.lessons,
          outcome: w.outcome,
          hrs: w.hrs,
          num: w.num,
          status: w.status,
          url: w.url,
          id: w.id
        }))
        setEventsList(temp);
        setSelEvents(temp.filter(e => e.start.getDate() === selDate.getDate()));
      }
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      setLoading(false);
    })
  }

  const deleteDetails = (id) => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            setModalVisible(false);
            setLoading(true);
            axiosInstance.delete(`staff/workdetails/delete/${id}`).then((res) => {
              if (res.data.status) {
                getWorkDetails();
                Alert.alert('Work Details deleted!')
              } else {
                Alert.alert('Error', 'Failed to delete Work Details');
              }
            }).catch((err) => {
              console.log(err);
              Alert.alert('Error', 'Failed to delete Work Details');
            }).finally(() => {
              setLoading(false);
            })
          }
        }
      ]
    )
  }

  const editData = (data) => {
    setModalVisible(false);
    console.log(data);
    delete data.end;
    navigation.navigate('AddForm', { ...data, start: dateStr(data.start) });
  }


  const signOut = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            setMenu(false);
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('role');
            navigation.navigate('Login');
          }
        },
      ]
    )
  }

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  useEffect(() => {
    setLoading(true);
    getWorkDetails();
  }, [])

  useEffect(() => {
    setSelEvents(eventsList.filter(e => e.start.getDate() === selDate.getDate()));
  }, [selDate])

  useEffect(() => {
    getRoleName();
  }, [])

  return (
    <View style={styles.container}>
      <Loading visible={loading} />
      <View>
        <View style={styles.calendar_head}>
          <Button onPress={() => setSelDate(new Date(selDate.getFullYear(), selDate.getMonth() - 1))}>
            <FontAwesome name='chevron-left' width={25} height={25} />
          </Button>
          <Text>{selectedDate(selDate)}</Text>
          <Button onPress={() => setSelDate(new Date(selDate.getFullYear(), selDate.getMonth() + 1))}>
            <FontAwesome name='chevron-right' width={25} height={25} />
          </Button>
        </View>
        <Calendar
          date={selDate}
          mode='month'
          events={eventsList}
          height={360}
          eventMinHeightForMonthView={3}
          renderEvent={RenderEvent}
          calendarCellStyle={styles.calendar}
          calendarCellTextStyle={{ textAlign: 'center', fontWeight: 'bold' }}
          headerContainerStyle={{ backgroundColor: '#30abe5' }}
          onPressCell={(date) => setSelDate(date)}
        />
      </View>
      <Text style={{ fontWeight: 'bold', padding: 8, marginTop: 260, marginBottom: 10, textAlign: 'center', backgroundColor: '#30abe5' }}>Entries on  - {selDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>

      <ScrollView style={{ padding: 5 }}>
        {
          selEvents?.map((item, index) =>
            <TouchableOpacity key={index} style={styles.card} onPress={() => handleItemPress(item)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <View style={styles.row}>
                    <Text style={styles.label}>Project</Text>
                    <Text style={styles.value}>{item.project}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Particulars</Text>
                    <Text style={styles.value}>{item.particulars}</Text>
                  </View>
                </View>
                <View >
                  {/* <Text style={styles.label}>Status</Text> */}
                  <Text style={{ fontWeight: 'bold', fontSize: 16, color: item.status === 'Completed' ? 'green' : 'red' }}>
                    {item.status}
                  </Text>
                </View>
              </View>

            </TouchableOpacity>)
        }
      </ScrollView>

      <TouchableOpacity style={styles.menuIcon} onPress={() => setMenu(true)} >
        <FontAwesome name='th-list' size={25} color='#fff' />
      </TouchableOpacity>

      {/* Menu modal */}
      <Modal animationType="slide" transparent={true} visible={menu} onRequestClose={() => setMenu(false)} >
        <View style={styles.menuModal}>
          <View style={styles.menuContent}>
            <Text style={styles.menuText}>Actions</Text>
            <TouchableOpacity style={styles.addIcon} onPress={() => {
              setMenu(false);
              navigation.navigate('AddForm');
            }} >
              <FontAwesome name='tasks' size={25} color='#00840b' />
              <Text style={styles.addText}>Add Work Detail</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addIcon} onPress={() => {
              setMenu(false);
              writeDataAndDownloadExcelFile(eventsList, contextVal?.user?.addressingname, setLoading);
            }} >
              <FontAwesome name='download' size={25} color='#0e536c' />
              <Text style={styles.addText}>Download</Text>
            </TouchableOpacity>

            {contextVal.user?.roleName === 'HOD' &&
              <TouchableOpacity style={styles.addIcon} onPress={() => {
                setMenu(false);
                navigation.navigate('User', { type: 'HOD', departmantName: contextVal?.user?.departmentName });
              }} >
                <FontAwesome name='user-plus' size={25} color='#14734c' />
                <Text style={styles.addText}>Users</Text>
              </TouchableOpacity>
            }

            <TouchableOpacity style={styles.addIcon} onPress={signOut} >
              <Ionicons name='exit' size={28} color='#d10b0bff' />
              <Text style={styles.addText}>Logout</Text>
            </TouchableOpacity>

            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <TouchableOpacity style={[styles.addIcon, { backgroundColor: '#d10b0bff', columnGap: 5 }]} onPress={() => setMenu(false)} >
                <Ionicons name='close' size={25} color='#ffffffff' />
                <Text style={[styles.addText, { color: '#ffffffff' }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Work detail modal */}
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)} >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Text style={styles.modalTitle}>Entry Details - {dateStr(selectedItem.start)}</Text>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Project</Text>
                  <Text style={styles.modalValue}>{selectedItem.project}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Particulars</Text>
                  <Text style={styles.modalValue}>{selectedItem.particulars}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Unit</Text>
                  <Text style={styles.modalValue}>{selectedItem.unit}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Lessons</Text>
                  <Text style={styles.modalValue}>{selectedItem.lessons}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Outcome</Text>
                  <Text style={styles.modalValue}>{selectedItem.outcome}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Hours</Text>
                  <Text style={styles.modalValue}>{selectedItem.hrs}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Number</Text>
                  <Text style={styles.modalValue}>{selectedItem.num}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Status</Text>
                  <Text style={styles.modalValue}>{selectedItem.status}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>URL</Text>
                  <Text style={styles.modalValue} numberOfLines={1}>{selectedItem.url || "-"}</Text>
                </View>
                <View style={{ flexDirection: 'row', columnGap: 15 }}>
                  <TouchableOpacity style={[styles.closeButton, { backgroundColor: '#1ca846' }]} onPress={() => editData(selectedItem)}   >
                    <Text style={styles.closeButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.closeButton, { backgroundColor: '#b7240a' }]} onPress={() => deleteDetails(selectedItem.id)}   >
                    <Text style={styles.closeButtonText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}   >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  calendar_head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#44b1e4',
    padding: 10,
  },
  calendar: {
    alignItems: 'center',
    borderColor: '#5e5e5e',
    backgroundColor: '#e6f6fa',
    padding: 3
  },
  details: {
    padding: 15,
    margin: 15,
    marginTop: 5,
    marginLeft: 5,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#d8f7ff',
  },
  menuIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
    right: 20,
    height: 50,
    width: 50,
    backgroundColor: '#035268',
    borderRadius: 100
  },
  menuModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000000',
  },
  menuContent: {
    backgroundColor: '#d5ede2ff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  menuText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
    textAlign: 'center',
    marginBottom: 20
  },
  addIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 15,
    marginBottom: 15,
    backgroundColor: '#f3f3f3',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden'
  },
  addText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#383838'
  },
  logoutIcon: {
    right: 20,
    height: 50,
    width: 50,
    backgroundColor: '#bb4141',
    borderRadius: 100
  },
  card: {
    backgroundColor: '#deeef0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    margin: 10
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
  },
  value: {
    flex: 2,
    color: '#333',
  },
  completed: {
    color: 'green',
  },
  pending: {
    color: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  modalLabel: {
    fontWeight: 'bold',
    color: '#555',
    flex: 1,
  },
  modalValue: {
    flex: 2,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})

export default Home;