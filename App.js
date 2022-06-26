import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, ScrollView, TextInput, Modal, Alert, Pressable} from 'react-native';

import Cart from "./Cart";

import {decode, encode} from 'base-64';

if (!global.btoa) {
  global.btoa = encode
}

if (!global.atob) {
  global.atob = decode
}

export default function App() {
  return (
    <View style={{flex: 1}}>
      <StatusBar style="auto"/>
      <Cart />
    </View>
  );
}
