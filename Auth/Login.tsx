import React, { Component } from "react";
import {
  Alert,
  Button,
  TextInput,
  Text,
  View,
  StyleSheet,
  ImageStyle,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  GestureResponderEvent,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../navigation/RootStackParams";

import RNRestart from 'react-native-restart';
import App from "../App";
import AuthUtils, { ResponseType, User } from "../util/AuthUtils";

type MyProps = {
  navigation: NativeStackNavigationProp<RootStackParams, "Login">;
};

type MyState = {
  user: User,
  success: boolean
}
class Login extends Component<MyProps, MyState> {

  state: MyState = { user: { email: "", password: "", accessToken: "" }, success: false };

  private loginPressed = (e: GestureResponderEvent): void => {

    AuthUtils.attemptAuthentication(this.state.user).then(res => {
      if (res == ResponseType.OK) {
        this.setState({ success: true })
      }
      else if (res == ResponseType.INVALID_CREDENTIALS) {
        Alert.alert("Invalid email/password");
      } else {
        Alert.alert("Unknown error ocurred");
      }
    })

  };

  public render() {
    if (this.state.success) {
      return <App />;
    }

    return (

      <View style={styles.view}>
        <Text style={styles.header}> LOGIN </Text>
        <View>
          <TextInput
            style={styles.input}
            onChange={(e) => { this.setState({ user: { ...this.state.user, email: e.nativeEvent.text } }) }}
            placeholder='Enter Email'
          />
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            onChange={(e) => {
              this.setState({ user: { ...this.state.user, password: e.nativeEvent.text } })
            }}
            placeholder='Enter Password'
          />
          <TouchableOpacity style={styles.button} onPress={this.loginPressed}>
            <Text> Login</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.hint}> Do you already have an account? </Text>
        <TouchableOpacity
          style={styles.registerBUtton}
          onPress={() => {
            this.props.navigation.navigate("Register");
          }}
        >
          <Text> Register </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Login;

const styles = StyleSheet.create({
  header: {
    color: "#1A1A0F",
    textAlign: "center",
    fontSize: 30,
    paddingBottom: 10,
    marginBottom: 10,
    marginTop: 20
  },
  hint: {
    color: "#74776B",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
    padding: 15,
    backgroundColor: "#F8F8F2",
  },
  input: {
    padding: 15,
    fontSize: 15,
    borderWidth: 1,
    marginBottom: 10,
  },
  button: {
    padding: 15,
    fontSize: 15,
    borderWidth: 1,
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "#8FE388",
  },
  registerBUtton: {
    padding: 15,
    fontSize: 15,
    borderWidth: 1,
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "#88c6e3",
  },
  view: {
    padding: 10,
    // paddingTop: 0
  },
});
