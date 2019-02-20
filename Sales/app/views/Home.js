import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native'

export default class Home extends React.Component {
    static navigationOptions = {
        title: 'Back2Bikes',
    }

  render() {
    return (
      <View style={styles.container}>

        <Text>Please Log In</Text>
        
        <Button 
            title="Login"
            onPress={() => this.props.navigation.navigate('Profile')}
        />

      </View>
    );
  }
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})



