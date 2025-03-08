import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import Login from '../screens/Login';
import Register from '../screens/Register';
import Home from '../screens/Home';
import AddForm from '../screens/AddForm';
import Admin from '../screens/Admin';
import User from '../screens/User';

function MainNavigation() {
    const Stack= createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Admin" component={Admin} />
        <Stack.Screen name="User" component={User} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AddForm" component={AddForm} />
    </Stack.Navigator>
  )
}

export default MainNavigation