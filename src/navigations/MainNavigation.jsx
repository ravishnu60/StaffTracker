import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import Login from '../screens/Login';
import Register from '../screens/Register';
import Home from '../screens/Home';

function MainNavigation() {
    const Stack= createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  )
}

export default MainNavigation