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

interface Styles {
  header: TextStyle;
  input: TextStyle;
  hint: TextStyle;
  button: TextStyle;
  view: ViewStyle;
  registerBUtton: TextStyle;
}

type MyState = {
  email: string;
  password: string;
};

type MyProps = {
  navigation: NativeStackNavigationProp<RootStackParams, "Login">;
};

class Login extends Component<MyProps, MyState> {
  
  state: MyState = { email: "", password: "" };

  private loginPressed = (e: GestureResponderEvent): void => {
    alert(this.state.email + " - " + this.state.password);
    this.setState({ email: "hello" });
  };

  public render() {
    return (
      <View style={styles.view}>
        <Text style={styles.header}> LOGIN </Text>
        <View>
          <TextInput
            style={styles.input}
            onChange={(e) => {
              this.state.email = e.nativeEvent.text;
            }}
            placeholder='Enter Email'
          />
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            onChange={(e) => {
              this.state.password = e.nativeEvent.text;
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

const styles = StyleSheet.create<Styles>({
  header: {
    color: "#1A1A0F",
    textAlign: "center",
    fontSize: 30,
    paddingBottom: 10,
    marginBottom: 10,
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
