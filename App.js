import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, ScrollView, TextInput, Modal, Alert, Pressable} from 'react-native';
import {initializeApp} from "firebase/app";
import {initializeFirestore, collection, query, where, getDocs} from 'firebase/firestore';
import {useRef, useState} from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import Constants from 'expo-constants';

import Cart from "./Cart";

import {decode, encode} from 'base-64';

if (!global.btoa) {
  global.btoa = encode
}

if (!global.atob) {
  global.atob = decode
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZ_JltOsJgjL1RfbNs9l1gQYAOJLHwrh4",
  authDomain: "phojaiweb.firebaseapp.com",
  databaseURL: "https://phojaiweb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "phojaiweb",
  storageBucket: "phojaiweb.appspot.com",
  messagingSenderId: "20783023299",
  appId: "1:20783023299:web:3bf522854249c0bd384e76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);

  const [barcode, onChangeBarcode] = useState(null);
  const [productName, setProductName] = useState(null);
  const [unitPrice, setUnitPrice] = useState(null);

  const childRef = useRef();

  const [cartItems, setCartItems] = useState([{a: 1}]);

  const HandleSearch = async () => {
    console.log('HandleSearch with : ' + barcode);

    const dbRef = collection(firestore, 'Products');
    const dataQuery = query(dbRef, where('productId', '==', barcode));
    const snapshot = await getDocs(dataQuery);

    if (snapshot.empty) {
      console.log('snapshot is empty.');
    } else {
      snapshot.forEach(item => {
        setProductName(item.data().productName);
        setUnitPrice(item.data().salePrice);
        console.log(item.data().productName);
        console.log(item.data().salePrice);
      })
      setModalVisible(true);
    }
  }

  return (
    <View style={{flex: 1}}>
      <StatusBar style="auto"/>
      <ScrollView>
        <View style={styles.header}>
          <Text style={{fontSize: 24, fontWeight: "bold"}}>ค้นหาสินค้า</Text>
        </View>
        <View style={styles.container}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalHeader}>{productName}</Text>
              <Text style={styles.modalText}>{unitPrice} บาท</Text>
              <Pressable
                style={[styles.button,{backgroundColor:'green'}]}
                onPress={()=>childRef.current.addProduct(productName,unitPrice,1)}
              >
                <Text>เพิ่มลงในตะกร้า</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>ปิด</Text>
              </Pressable>
            </View>
          </Modal>
          {cartItems.length <= 0 ? <Text style={{
            alignSelf: 'center',
            marginTop: 360,
            fontSize: 16,
            color: '#cdcdcd'
          }}>ยังไม่มีสินค้าในตะกร้า</Text> : <Cart ref={childRef}/>}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeBarcode}
          placeholder="รหัสสินค้า"
          keyboardType="numeric"
        />
        <Pressable style={styles.scanButton} onPress={() => HandleSearch()}>
          <Icon name="barcode" size={24} color="#006400"/>
        </Pressable>
        <Pressable style={styles.searchButton} onPress={() => HandleSearch()}>
          <Text style={styles.textStyle}>ค้นหา</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'red',
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#ff0',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    height: 500,
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 8,
    //backgroundColor: '#f0ff00',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  footer: {
    flexDirection: "row",
    backgroundColor: '#006400',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchRow: {
    flexDirection: "row",
    //borderRadius:10,
    //borderWidth: 2,
    backgroundColor: 'red',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  input: {
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    padding: 10,
    flexGrow: 4,
  },
  scanButton: {
    backgroundColor: "#f0ffff",
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  searchButton: {
    backgroundColor: "#00ff00",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  modalView: {
    margin: 20,
    backgroundColor: "skyblue",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    paddingHorizontal: 50,
    backgroundColor: "#ff0000",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  modalHeader: {
    fontSize: 26,
    marginBottom: 15,
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginVertical: 20,
    marginHorizontal: 50,
  }
});
