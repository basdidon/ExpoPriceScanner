import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {BarCodeScanner} from "expo-barcode-scanner";
import Constants from "expo-constants";

const Scanner = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    props.scannerSearchCallback(data);
    setScanned(true);
    props.setModalVisibleCallback(true);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{flex:1}}>
      <View style={styles.header}>
        <Text style={{fontSize: 24, fontWeight: "bold"}}>สแกนบาร์โค้ด</Text>
      </View>
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.camera}
        />
      </View>
      {scanned && <Button style={styles.button} title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
      <Button style={styles.button} title={'Back'} onPress={()=> props.setScannerActiveCallback(false)}/>
    </View>
  );
}

export default Scanner;


const styles = StyleSheet.create({
  header: {
    backgroundColor: 'red',
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container:{
    flex:1,
    padding:20,
    backgroundColor:'#fff0c0',
  },
  camera: {
    flex:1,
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
