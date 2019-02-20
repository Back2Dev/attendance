import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'

export default class Settings extends React.Component {
    static navigationOptions = {
        title: 'Settings',
    }
  render() {
    return (
      <View style={styles.container}>
        <Text>Settings</Text>

        {/* UserDetails edit Component */}

        {/* Emergency contact details edit Component */}

        {/* card details edit Component */}

        {/* Notifications settings Component */}

        <Button 
            title="Back to Profile"
            onPress={() => this.props.navigation.navigate('Profile')}
        />

      </View>
    )
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
