import { Component } from "react";
import {
  Alert,
  TextInput,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../navigation/RootStackParams";

import AuthUtils, { ResponseType, UserAuthDetails } from "../util/AuthUtils";
import { Loading } from "../util/Loading";
import { CommonStyle } from '../util/Styles'

type MyProps = {
  navigation: NativeStackNavigationProp<RootStackParams, "Login">,
  reauthenticateApp: any
};

type MyState = {
  user: UserAuthDetails,
  loading: boolean
}
class Login extends Component<MyProps, MyState> {

  state: MyState = { user: { email: "", password: "", accessToken: "" }, loading: false };

  private loginPressed = (e: GestureResponderEvent): void => {
    this.setState({ loading: true })

    AuthUtils.attemptAuthentication(this.state.user).then(res => {
      this.setState({ loading: false })

      if (res == ResponseType.OK) {
        this.props.reauthenticateApp();
      }
      else if (res == ResponseType.INVALID_CREDENTIALS) {
        Alert.alert("Invalid email/password");
      } else {
        Alert.alert("Unknown error ocurred");
      }
    })

  };

  public render() {

    if (this.state.loading) {
      return <Loading />
    }

    return (
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
        <View style={CommonStyle.formView}>
          <View>
            <Text style={CommonStyle.label}> Email: </Text>
            <TextInput
              style={CommonStyle.input}
              onChange={(e) => { this.setState({ user: { ...this.state.user, email: e.nativeEvent.text } }) }}
              placeholder='Enter Email'
            />
            <Text style={CommonStyle.label}> Password: </Text>
            <TextInput
              style={CommonStyle.input}
              secureTextEntry={true}
              onChange={(e) => {
                this.setState({ user: { ...this.state.user, password: e.nativeEvent.text } })
              }}
              placeholder='Enter Password'
            />
            <TouchableOpacity style={[CommonStyle.greenBorder, CommonStyle.greenBackground, { padding: 10, marginTop: 20, marginBottom: 20 }]} onPress={this.loginPressed}>
              <Text style={{ textAlign: 'center' }}> Login</Text>
            </TouchableOpacity>
          </View>
          <Text style={[CommonStyle.hint, { color: "#74776B", textAlign: "center", padding: 15 }]}> Don't have an account?  </Text>
          <TouchableOpacity
            style={[CommonStyle.greenBorder, CommonStyle.greenBackground, { padding: 10, marginTop: 20, marginBottom: 20 }]}
            onPress={() => {
              this.props.navigation.navigate("Register");
            }}
          >
            <Text style={{ textAlign: 'center' }}> Register </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default Login;