import React, { useEffect, useState } from 'react';
import { set } from 'react-hook-form';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import { Button, Text } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { date } from 'yup';

function Home({ navigation }) {
  const [selDate, setSelDate] = useState(new Date());
  const events = [
    { start: new Date('2025-02-14'), unit: 'Math', lesson: 'Algebra', status: 'Completed' },
    { start: new Date('2025-02-15'), unit: 'Science', lesson: 'Physics', status: 'Pending' },
    { start: new Date('2025-02-14'), unit: 'English', lesson: 'Grammar', status: 'Completed' },
    { start: new Date('2025-02-17'), unit: 'History', lesson: 'World War II', status: 'Ongoing' },
    { start: new Date('2025-02-18'), unit: 'Chemistry', lesson: 'Organic', status: 'Completed' },
  ];
  const [selEvents, setSelEvents] = useState([]);

  const selectedDate = (date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  }

  const RenderEvent = (e) => {
    console.log(e);
    return (
      // <View style={{flexGrow:1, alignItems:'center'}}>
      <View style={{ width: 4, height: 4, borderRadius: 100, backgroundColor: 'red' }} />
      // </View>
    )
  }

  useEffect(() => {
    setSelEvents(events.filter(e => e.start.getDate() === selDate.getDate()));

  }, [selDate])

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