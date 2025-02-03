import React from 'react'
import { View } from 'react-native'
import { Calendar } from 'react-native-big-calendar'

function Home() {
  const events = [
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
  ]
  return (
    <View>
      <Calendar mode='month' events={events} height={400}  />
    </View>
  )
}

export default Home