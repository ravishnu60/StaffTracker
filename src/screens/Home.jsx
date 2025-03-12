import React, { useContext, useEffect, useState } from 'react';
import { set } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import { Button, Text } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { date } from 'yup';
import axiosInstance from '../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContextData } from '../navigations/MainNavigation';

function Home({ navigation }) {
  const [selDate, setSelDate] = useState(new Date());
  const contextVal= useContext(ContextData);
  const events = [
    { start: new Date('2025-02-14'), unit: 'Math', lesson: 'Algebra', status: 'Completed' },
    { start: new Date('2025-02-15'), unit: 'Science', lesson: 'Physics', status: 'Pending' },
    { start: new Date('2025-02-14'), unit: 'English', lesson: 'Grammar', status: 'Completed' },
    { start: new Date('2025-02-17'), unit: 'History', lesson: 'World War II', status: 'Ongoing' },
    { start: new Date('2025-02-18'), unit: 'Chemistry', lesson: 'Organic', status: 'Completed' },
  ];
  const [selEvents, setSelEvents] = useState([]);
  const [role, setRole] = useState('');

  const selectedDate = (date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  }

  const RenderEvent = (e) => {
    // console.log(e);
    return (
      // <View style={{flexGrow:1, alignItems:'center'}}>
      <View style={{ width: 4, height: 4, borderRadius: 100, backgroundColor: 'red' }} />
      // </View>
    )
  }

  const getRoleName = async () => {
    const role = await AsyncStorage.getItem('role');
    setRole(role);
  }

  const getWorkDetails = () => {
    axiosInstance({
      method: 'GET',
      url: 'staff/workdetails/findAll'
    }).then((res) => {
      console.log(res.data);

    }).catch((err) => {
      console.log(err);
    })
    // console.log(selEvents);
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
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('role');
            navigation.navigate('Login');
          }
        },
      ]
    )
  }

  useEffect(() => {
    setSelEvents(events.filter(e => e.start.getDate() === selDate.getDate()));
    getWorkDetails();
  }, [selDate])

  useEffect(() => {
    getRoleName();
  }, [])


  return (
    <View style={styles.container}>
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
          events={events}
          height={360}
          eventMinHeightForMonthView={3}
          renderEvent={RenderEvent}
          calendarCellStyle={styles.calendar}
          calendarCellTextStyle={{ textAlign: 'center', fontWeight: 'bold' }}
          headerContainerStyle={{ backgroundColor: '#30abe5' }}
          onPressCell={(date) => setSelDate(date)}
        />
      </View>
      <Text style={{ fontWeight: 'bold', padding: 5, marginTop: 250, marginBottom: 10 }}>Entries on  - {selDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>

      <ScrollView style={{ padding: 5 }}>
        {
          selEvents.map((items, index) =>
            <View key={index} style={styles.details}>
              <Text style={{ fontWeight: 'bold', padding: 5 }}>{items.unit} - <Text style={{ fontSize: 13 }}>{items.lesson}</Text></Text>
              <Text style={{ fontSize: 13 }}>{items.status}</Text>
            </View>)
        }
      </ScrollView>
      {/* plus icon for add form */}
      <TouchableOpacity style={styles.logoutIcon} onPress={signOut} >
        <FontAwesome name='sign-out' size={25} color='#fff' />
      </TouchableOpacity>

      {contextVal.user?.roleName === 'HOD' &&
        <TouchableOpacity style={styles.userIcon} onPress={() => navigation.navigate('User', { type: 'HOD', departmantName: contextVal?.user?.departmentName })} >
          <FontAwesome name='users' size={25} color='#fff' />
        </TouchableOpacity>
      }

      <TouchableOpacity style={styles.addIcon} onPress={() => navigation.navigate('AddForm')} >
        <FontAwesome name='plus' size={25} color='#fff' />
      </TouchableOpacity>
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
    padding: 10,
    margin: 15,
    marginTop: 5,
    marginLeft: 5,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#85d7ec',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoutIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 150,
    right: 20,
    height: 50,
    width: 50,
    backgroundColor: '#bb4141',
    borderRadius: 100
  },
  userIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 80,
    right: 20,
    height: 50,
    width: 50,
    backgroundColor: '#41bb69',
    borderRadius: 100
  },
  addIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
    right: 20,
    height: 50,
    width: 50,
    backgroundColor: '#44b1e4',
    borderRadius: 100
  }
})

export default Home;