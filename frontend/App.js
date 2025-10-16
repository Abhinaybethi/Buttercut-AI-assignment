// App.js
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import EditorScreen from './src/screens/EditorScreen';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111' }}>
      <StatusBar barStyle="light-content" />
      <EditorScreen />
    </SafeAreaView>
  );
}
