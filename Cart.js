import React, {useState, forwardRef, useImperativeHandle} from "react";
import {View, Text, Image, StyleSheet, Pressable} from "react-native";
import productBoxImg from "./images/product.png"
import Icon from 'react-native-vector-icons/FontAwesome';

const CartItem = (props) => {
  return <View style={styles.cartItem}>
    <View style={styles.itemImage}>
      <Image
        style={styles.tinyLogo}
        source={productBoxImg}
      />
    </View>
    <View style={{flexDirection: 'column', backgroundColor: '#6effee', flexGrow: 1}}>
      <View style={{flexDirection: 'row', alignItems: 'stretch'}}>
        <Text numberOfLines={2} ellipsizeMode='tail' style={{
          backgroundColor: '#607cf7',
          fontSize: 20,
          fontWeight:'bold',
          padding: 4,
          flexGrow: 1,
          maxWidth: 260
        }}>{props.productName}</Text>
        <Icon name={'close'} color={'white'} size={24}/>
      </View>
      <View style={{flexDirection: 'row', flexGrow: 1}}>
        <View style={{flexDirection: 'column', flexGrow: 3, justifyContent: 'space-around'}}>
          <Text>@ {props.unitPrice}฿</Text>
          <View style={{flexDirection: 'row'}}>
            <Pressable><Icon name={'minus'} size={16} color="#ff0000"/></Pressable>
            <Text>{props.quantity}</Text>
            <Pressable><Icon name={'plus'} size={16} color="#ff0000"/></Pressable>
          </View>
        </View>
        <View style={{
          backgroundColor: '#cdcd04',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          flexGrow: 1,
          padding: 8
        }}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>{props.unitPrice*props.quantity} ฿</Text>
        </View>
      </View>
    </View>
  </View>
}

const Cart = forwardRef((props, ref) => {
  const [cartItems, setCartItems] = useState([]);

  const renderCartItems = () => {
    let temp = []
    cartItems.forEach((item)=>{
      temp.push(<CartItem productName={item.productName} unitPrice={item.unitPrice} quantity={1}/>);
    })
    return temp;
  }

  useImperativeHandle(ref, () => ({
    addProduct:(productName, unitPrice, quantity) => {
      let temp = cartItems;
      temp.push({productName: productName, unitPrice: unitPrice, quantity: quantity});
      setCartItems(temp);
      alert(cartItems.length);
    }
  }));

  return <View style={styles.container}>
    {renderCartItems()}
  </View>
});


export default Cart;
// module.exports = {
//   Add,
// }

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'skyblue',
    paddingHorizontal: 8,
    paddingVertical: 10,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: '#fdf0f0',
    marginBottom: 8,
    padding: 8,
    alignItems: 'stretch',
  },
  itemImage: {
    backgroundColor: "#c6eb34",
    padding: 4,
    marginRight: 8,
    justifyContent: "center"
  },
  tinyLogo: {
    width: 86,
    height: 86,
  },

})
