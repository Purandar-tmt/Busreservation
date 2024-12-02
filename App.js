import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from './src/homeScreen';
import { Booking } from './src/booking';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="home">
        <Stack.Screen 
          name="home" 
          component={Home} 
          options={{ title: 'Bus Reservation System' }}
        />
        <Stack.Screen 
          name="booking" 
          component={Booking} 
          options={{ title: 'Book a Seat' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
