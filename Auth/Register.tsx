import React, { Component } from 'react';
import { TextInput, Text, View, StyleSheet, TextStyle, ViewStyle, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../navigation/RootStackParams';

interface Styles {
    header: TextStyle;
    input: TextStyle;
    hint: TextStyle;
    button: TextStyle;
    loginButton: TextStyle,
    view: ViewStyle
}

type MyState = {
    username: string;
    password: string,
    confirmPassword: string,
    email: string
};

type MyProps = {
    navigation: NativeStackNavigationProp<RootStackParams, 'Login'>
};

class Register extends Component<MyProps, MyState>{

    state: MyState = { username: "", password: "", confirmPassword: "", email: "" };

    private registerPressed = (e: GestureResponderEvent): void => {
        alert(this.state.username + " - " + this.state.password);
        this.setState({ username: "hello" });
    }

    public render() {
        return (
            <View style={styles.view} >
                <Text style={styles.header}> Register </Text>
                <View >
                    <TextInput style={styles.input} onChange={(e) => { this.state.username = e.nativeEvent.text }} placeholder="Enter Username" />
                    <TextInput style={styles.input} onChange={(e) => { this.state.email = e.nativeEvent.text }} placeholder="Enter Email" />
                    <TextInput style={styles.input}
                        secureTextEntry={true}
                        onChange={(e) => { this.state.password = e.nativeEvent.text }}
                        placeholder="Enter Password"
                    />
                    <TextInput style={styles.input}
                        secureTextEntry={true}
                        onChange={(e) => { this.state.confirmPassword = e.nativeEvent.text }}
                        placeholder="Confirm Password"
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.registerPressed}
                    >
                        <Text> Register </Text></TouchableOpacity>
                </View>
                <Text style={styles.hint}> Do you already have an account? </Text>
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => { this.props.navigation.navigate('Login') }}
                >
                    <Text> Login </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default Register;

const styles = StyleSheet.create<Styles>({
    header: {
        color: "#1A1A0F",
        textAlign: 'center',
        fontSize: 30,
        paddingBottom: 10,
        marginBottom: 10,
    },
    hint: {

        color: "#74776B",
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        padding: 15,
        backgroundColor: "#F8F8F2"

    },
    input: {
        padding: 15,
        fontSize: 15,
        borderWidth: 1,
        marginBottom: 10
    },
    button: {
        padding: 15,
        fontSize: 15,
        borderWidth: 1,
        textAlign: 'center',
        fontWeight: "bold",
        backgroundColor: "#8FE388"

    },
    loginButton: {
        padding: 15,
        fontSize: 15,
        borderWidth: 1,
        textAlign: 'center',
        fontWeight: "bold",
        backgroundColor: "#88c6e3"

    },
    view: {
        padding: 10
    }
});

