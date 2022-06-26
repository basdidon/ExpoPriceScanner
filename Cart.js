import React, {useState, useEffect} from "react";
import {View, Text, Image, StyleSheet, Pressable, ScrollView, Modal, Alert, TextInput} from "react-native";
import {initializeApp} from "firebase/app";
import {initializeFirestore, collection, query, where, getDocs} from 'firebase/firestore';
import Scanner from './Scanner';

import productBoxImg from "./images/product.png";
import Icon from 'react-native-vector-icons/FontAwesome';
import Constants from "expo-constants";

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

const CartItem = (props) => {

  const handleRemove = () => {
    console.log('handleRemove(',props.index,')');
    props.removeItemCallback(props.index);
  }

  const handleIncrease =()=>{
    console.log('handleIncrease(',props.index,')');
    props.increaseQuantityCallback(props.index);
  }

  const handleDecrease = () => {
    console.log('handleDecrease(',props.index,')');

    if(props.item.quantity-1<=0){
      handleRemove()
    }else {
      props.decreaseQuantityCallback(props.index);
    }
  }

  return <View style={styles.cartItem}>
    <View style={styles.itemImage}>
      <Image
        style={styles.tinyLogo}
        source={productBoxImg}
      />
    </View>
    <View style={{flexDirection: 'column', flexGrow: 1}}>
      <View style={{flexDirection: 'row',backgroundColor: '#fffae0',alignItems: 'stretch'}}>
        <Text numberOfLines={2} ellipsizeMode='tail' style={{
          fontSize: 20,
          fontWeight: 'bold',
          padding: 4,
          flexGrow: 1,
          maxWidth: 260
        }}>{props.item.productName}</Text>
        <Pressable onPress={()=>{handleRemove()}}>
          <Icon name={'close'} color={'red'} size={24} style={{padding:2}}/>
        </Pressable>
      </View>
      <View style={{flexDirection: 'row', flexGrow: 1}}>
        <View style={{flexDirection: 'column', flexGrow: 3, justifyContent: 'space-around',padding:4}}>
          <Text>{props.item.unitPrice} ฿</Text>
          <View style={{flexDirection: 'row',justifyContent:'space-around' ,paddingHorizontal:4 ,paddingVertical:4}}>
            <Pressable onPress={()=>handleDecrease()}><Icon name={'minus'} size={16} color="white" style={{backgroundColor:'#ff0000',paddingHorizontal:6,paddingVertical:5, borderRadius:12}}/></Pressable>
            <Text>{props.item.quantity}</Text>
            <Pressable onPress={()=>handleIncrease()}><Icon name={'plus'} size={16} color="white" style={{backgroundColor:'#ff0000',paddingHorizontal:6,paddingVertical:5, borderRadius:12}}/></Pressable>
          </View>
        </View>
        <View style={{
          backgroundColor: '#cdcd04',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          flexGrow: 1,
          padding: 8
        }}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>{props.item.unitPrice * props.item.quantity} ฿</Text>
        </View>
      </View>
    </View>
  </View>
}

const Cart = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeScanner, setActiveScanner] = useState(false);

  const [barcode, setBarcode] = useState(null);
  const [newProduct, setNewProduct] = useState({
    productName:'',
    unitPrice:0,
    quantity:0,
  });
  const [cartItems, setCartItems] = useState([]);

  const HandleSearch = async () => {
    console.log('HandleSearch with : ' + barcode);

    const dbRef = collection(firestore, 'Products');
    const dataQuery = query(dbRef, where('productId', '==', barcode));
    const snapshot = await getDocs(dataQuery);

    if (snapshot.empty) {
      console.log('snapshot is empty.');
    } else {
      snapshot.forEach(item => {
        setNewProduct({
          productName:item.data().productName,
          unitPrice:item.data().salePrice,
          quantity:1,
        })
        console.log(item.data().productName);
        console.log(item.data().salePrice);
      })
      setModalVisible(true);
    }
  }

  const AddProduct = () => {
    let isFound = false;
    let newCartItems = [...cartItems];

    cartItems.forEach((item) => {
      if (item.productName === newProduct.productName) {
        isFound = true
        item.quantity += newProduct.quantity
      }
    });

    if (!isFound) {
      newCartItems = [...cartItems,newProduct];
    }

    setCartItems(newCartItems);
    setModalVisible(false);
  }

  const IncreaseQuantity = (i) => {
    const newCartItems = [...cartItems];
    newCartItems[i].quantity += 1;
    setCartItems(newCartItems);
  }

  const DecreaseQuantity = (i) => {
    const newCartItems = [...cartItems];
    newCartItems[i].quantity -= 1;
    setCartItems(newCartItems);
  }

  const RemoveProduct = (i) => {
    console.log(i);
    const temp = [...cartItems];
    temp.splice(i,1);
    setCartItems(temp);
  }

  const getTotalPrice = () => {
    let totalPrice = 0;
    cartItems.forEach((i) => {
      totalPrice += i.quantity * i.unitPrice;
    })
    return totalPrice
  }

  const renderCartItems = () => {
    let temp = cartItems.map((item,index) => (
     <CartItem
        item = {item}
        index={index}
        removeItemCallback={RemoveProduct}
        increaseQuantityCallback={IncreaseQuantity}
        decreaseQuantityCallback={DecreaseQuantity}
      />)
    )
    return temp;
  }

  if(activeScanner){
    return <Scanner setScannerActiveCallback={setActiveScanner} setBarcodeCallback={setBarcode} addProductCallback={AddProduct} />;
  }

  return <View style={{flex: 1}}>
    <ScrollView>
      <View style={styles.header}>
        <Text style={{fontSize: 24, fontWeight: "bold"}}>ตะกร้าสินค้า</Text>
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
            <Text style={styles.modalHeader}>{newProduct.productName}</Text>
            <Text style={styles.modalText}>{newProduct.unitPrice} บาท</Text>
            <Pressable
              style={[styles.button, {backgroundColor: 'green'}]}
              onPress={() => AddProduct()}
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
        }}>ยังไม่มีสินค้าในตะกร้า</Text> : <View style={styles.cartContainer}>{renderCartItems()}</View>}
      </View>
    </ScrollView>
    {
      cartItems.length <= 0 ? undefined : <View style={styles.totalPriceView}>
        <Text style={{fontSize: 16}}>ราคารวม :   </Text>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>{getTotalPrice()} ฿</Text>
      </View>
    }
    <View style={styles.footer}>
      <TextInput
        style={styles.input}
        onChangeText={setBarcode}
        placeholder="รหัสสินค้า"
        keyboardType="numeric"
      />
      <Pressable style={styles.scanButton} onPress={() => setActiveScanner(true)}>
        <Icon name="barcode" size={24} color="#006400"/>
      </Pressable>
      <Pressable style={styles.searchButton} onPress={() => HandleSearch()}>
        <Text style={styles.textStyle}>ค้นหา</Text>
      </Pressable>
    </View>
  </View>
};


export default Cart;

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'red',
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#fff',
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
  },
  cartContainer: {
    // backgroundColor: 'skyblue',
    paddingHorizontal: 8,
    paddingVertical: 10,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  cartItem: {
    backgroundColor: 'white',
    flexDirection: "row",
    marginBottom: 8,
    padding: 8,
    alignItems: 'stretch',
    borderRadius: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  itemImage: {
    backgroundColor: "#c6ff34",
    padding: 4,
    marginRight: 8,
    justifyContent: "center",
    borderRadius:15,
  },
  tinyLogo: {
    width: 86,
    height: 86,
  },
  totalPriceView:{
    flexDirection:'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 6,
    borderTopColor: 'lightgreen',
    borderTopWidth:1,
  },
})
