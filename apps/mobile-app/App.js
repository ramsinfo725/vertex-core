import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import BeatScreen from './screens/BeatScreen';
import OrderScreen from './screens/OrderScreen';
import StockScreen from './screens/StockScreen';
import MapScreen from './screens/MapScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Beat" component={BeatScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="Order" component={OrderScreen} />
          <Stack.Screen name="Stock" component={StockScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
