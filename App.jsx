import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import MainNavigation from './src/navigations/MainNavigation';

function App() {
  return (
    <NavigationContainer>
      <MainNavigation />
    </NavigationContainer>
  )
}

export default App
