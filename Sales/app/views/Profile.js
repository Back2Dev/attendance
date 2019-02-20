import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'

export default class Profile extends React.Component {
    static navigationOptions = {
        title: 'User Profile',
    }
  render() {
    return (
      <View style={styles.container}>

        <Text>User Profile</Text>

        {/* Avatar and Name Component */}

        {/* You have sessions Component */}

        {/* You have subscriptions Component */}

        {/* You have workshops Component */}

        {/* Payment History Component */}

        {/* Attendance History Component */}

        <Button 
            title="Settings"
            onPress={() => this.props.navigation.navigate('Settings')}
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
