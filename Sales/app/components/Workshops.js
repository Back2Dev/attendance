import React, { Component } from 'react'
import { Text, View, AppRegistry, StyleSheet, TouchableHighlight, TextInput} from 'react-native'
// import Stripe from 'tipsi-stripe';
import Stripe from 'react-native-stripe-api'




export default class Workshops extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
            cardNumber: "",
            expMonth: "",
            expYear: "",
            cvc: ""
      }
    }
    
// GUY MOVE THE CARD STUFF INTO ITS OWN COMPONENT - ESSENTIALLY ITS OWN STRIPE CHECKOUT
payme() {
    alert("ouch")
    const apiKey = "pk_test_315Jrr5E4VK9O1motqWvTJS9"
    const client = new Stripe(apiKey)
    const token = client.createToken('4242424242424242' , '09', '18', '123')
    .then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err)
    });
}

// i might have to include the id of a user

  render() {
    return (
      <View>
        <TextInput style={styles.dog}
            onChangeText={(cardNumber) => this.setState({cardNumber})}
            // value={'4242424242424242'}
          
            placeholder={""}
            // color={"red"}
            placeholderTextColor={"green"}
        />
        <TextInput style={styles.dog}
            onChangeText={(expMonth) => this.setState({expMonth})}
            // value={'11'}
            placeholder={""}
            // color={"red"}
            placeholderTextColor={"green"}
        />
        <TextInput style={styles.dog}
            onChangeText={(expYear) => this.setState({expYear})}
            // value={'22'}
            placeholder={""}
            // color={"red"}
            placeholderTextColor={"green"}
        />
        <TextInput style={styles.dog}
            onChangeText={(cvc) => this.setState({cvc})}
            // value={'123'}
            placeholder={""}
            // color={"red"}
            placeholderTextColor={"green"}
        />





        <Text> Workshops component - you have purchased
            workshop 1,

            want to buy workshop 2 "The workshopinator"?
        </Text>

        <TouchableHighlight onPress={this.payme.bind(this)} underlayColor={'transparent'}>
            {/* <View style={styles.box}> */}
                <Text style={styles.dog}>
                    Add card
                </Text>
            {/* </View> */}
        </TouchableHighlight>

      </View>
    )
  }
}

const styles = StyleSheet.create({
    something: {
        width: 300,
        height: 50,
        alignSelf: "center",
        marginTop: 10,
        backgroundColor: "green",
    },
    dog: {
        height: 50,
        width: 300,
        alignSelf: "center",
        backgroundColor: "cyan",
        marginTop: 10
    }
})