import React from 'react';
import { SafeAreaView, StatusBar, View, Text, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditorScreen from './screens/EditorScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Editor"
          component={EditorScreen}
          options={{ title: 'Buttercut AI – Video Editor' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
