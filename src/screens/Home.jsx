import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import { Button, Text } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

function Home() {
  const [selDate, setSelDate] = useState(new Date());
  const [events, setEvents] = useState([
    {
      title: 'Meeting',
      start: new Date(2025, 0, 28, 10, 0),
      end: new Date(2025, 0, 28, 10, 30),
    },
    {
      title: 'Meeting',
      start: new Date(2025, 0, 28, 10, 0),
      end: new Date(2025, 0, 28, 10, 30),
    },
    {
      title: 'Meeting',
      start: new Date(2025, 0, 28, 10, 0),
      end: new Date(2025, 0, 28, 10, 30),
    },
    {
      title: 'Meeting',
      start: new Date(2025, 0, 28, 10, 0),
      end: new Date(2025, 0, 28, 10, 30),
    },
    {
      title: 'Meeting',
      start: new Date(2025, 0, 28, 10, 0),
      end: new Date(2025, 0, 28, 10, 30),
    },
    {
      title: 'Meeting',
      start: new Date(2025, 0, 28, 10, 0),
      end: new Date(2025, 0, 28, 10, 30),
    },
    {
      title: 'Coffee break',
      start: new Date(2025, 0, 31, 15, 45),
      end: new Date(2025, 0, 31, 16, 30),
    },
  ])

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
          height={400}
          eventMinHeightForMonthView={3}
          eventCellStyle={{ flex: 1 }}
          renderEvent={RenderEvent}
          calendarCellStyle={styles.calendar}
          calendarCellTextStyle={{ flex: 5, textAlign: 'center', fontWeight:'bold' }}
          headerContainerStyle={{backgroundColor:'#30abe5'}}
        />
      </View>
      <View style={{padding:5, marginTop:300}}>
        {
          events.map((items, index)=>
          <View key={index}>
            <Text>{items.title}</Text>
          </View>)
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff'
  },
  calendar_head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#44b1e4',
    padding: 10,
  },
  calendar:{
    flexDirection: 'row', 
    flex: 2, 
    justifyContent: 'flex-start', 
    alignItems: 'flex-end', 
    borderColor: '#5e5e5e', 
    backgroundColor:'#e6f6fa', 
    padding:3
  }
})

export default Home;