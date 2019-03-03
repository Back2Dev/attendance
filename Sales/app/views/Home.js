import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

export default class Home extends React.Component {
  static navigationOptions = {
    title: "Back2Bikes"
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Please log in</Text>

        <Button style={styles.box} title="Used: 3" />
        <Button style={styles.box} title="Credit: 5" />

        <Button
          title="Login"
          onPress={() => this.props.navigation.navigate("Profile")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: "red"
  },
  box: {
    backgroundColor: "#ff4444",
    color: "black",
    borderColor: "red"
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
