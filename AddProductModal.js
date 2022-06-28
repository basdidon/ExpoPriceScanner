import React, {useEffect, useState} from 'react';
import {Modal, TouchableOpacity, StyleSheet, Text, View, TextInput} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const AddProductModal = (props) => {
  const [number, setNumber] = useState(1);

  useEffect(()=>{
    setNumber(1);
  })

  const increaseQuantity = () => {
    setNumber(props.newProduct.quantity+1);
    props.setQuantityCallback(props.newProduct.quantity+1);
  }

  const decreaseQuantity = () => {
    let newValue = props.newProduct.quantity-1;
    if(newValue < 1){
      newValue = 1;
    }

    setNumber(newValue);
    props.setQuantityCallback(newValue);
  }

  function handleAddProduct() {
    props.addProductCallback();
  }

  return (<Modal
    animationType="slide"
    transparent={true}
    visible={props.isVisible}
    onRequestClose={() => {
      console.log("Modal has been closed.");
      props.setVisibleCallback(false);
    }}
  >
    <View style={styles.modalView}>
      <Text style={styles.modalHeader}>{props.newProduct.productName}</Text>
      <Text style={styles.modalText}>{props.newProduct.unitPrice} บาท</Text>
      <View style={{backgroundColor:'#fff', flexDirection: 'row',justifyContent:'space-between' ,paddingHorizontal:4 ,paddingVertical:4,marginVertical: 20,borderRadius:20}}>
        <TouchableOpacity onPress={()=>decreaseQuantity()}><Icon name={'minus'} size={24} color="white" style={{backgroundColor:'#ff0000',paddingHorizontal:6,paddingVertical:5, borderRadius:24}}/></TouchableOpacity>
        <Text>{props.newProduct.quantity}</Text>
        <TouchableOpacity onPress={()=>increaseQuantity()}><Icon name={'plus'} size={24} color="white" style={{backgroundColor:'#ff0000',paddingHorizontal:6,paddingVertical:5, borderRadius:24}}/></TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.button, {backgroundColor: 'green'}]}
        onPress={() => handleAddProduct()}
      >
        <Text style={styles.textStyle}>เพิ่มลงในตะกร้า</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.buttonClose]}
        onPress={() => props.setVisibleCallback(false)}
      >
        <Text style={styles.textStyle}>ปิด</Text>
      </TouchableOpacity>
    </View>
  </Modal>);
}

export default AddProductModal;

const styles = StyleSheet.create({
  modalView: {
    marginTop:120,
    marginHorizontal: 36,
    backgroundColor: "skyblue",
    borderRadius: 20,
    paddingHorizontal: 36,
    paddingVertical:24,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5
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
  button: {
    borderRadius: 20,
    marginVertical:6,
    padding: 10,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonClose: {
    paddingHorizontal: 50,
    backgroundColor: "#ff0000",
  },
})
