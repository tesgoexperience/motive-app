import React, { Component } from 'react';
import { TextInput, Text, View, StyleSheet, TextStyle, ViewStyle, TouchableOpacity, GestureResponderEvent, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../navigation/RootStackParams';

enum FIELDS {
    EMAIL,
    PASSWORD,
    USERNAME,
    CONFIRM_PASSWORD
}

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
    email: string,
    errors: Array<FIELDS>
};

type MyProps = {
    navigation: NativeStackNavigationProp<RootStackParams, 'Login'>
};

class Register extends Component<MyProps, MyState>{

    state: MyState = { username: "", password: "", confirmPassword: "", email: "", errors: [] };

    private registerPressed = (e: GestureResponderEvent): void => {
        alert(this.state.username + " - " + this.state.password);
        this.setState({ username: "hello" });
    }

    public pickStyle(field: FIELDS) {
        if (this.state.errors.includes(field)) {
            return { borderColor: "red" };
        }
    }
    public render() {
        return (
            <ScrollView style={styles.view}>
                <Text style={styles.header}> Register </Text>
                <View >

                    <Text style={styles.label}>Username: </Text>
                    <TextInput style={[styles.input, this.pickStyle(FIELDS.USERNAME)]} onChange={(e) => { this.setState({ username: e.nativeEvent.text }) }} placeholder="Enter Username" />
                    <Text style={styles.inputHint}>Pick a unique name that you will be able to remember. Something like Tresco!</Text>

                    <Text style={styles.label}>Email: </Text>
                    {/* if email is taken show alert */}
                    <TextInput style={[styles.input, this.pickStyle(FIELDS.EMAIL)]} onChange={(e) => { this.setState({ email: e.nativeEvent.text }) }} placeholder="Enter Email" />
                    <Text style={styles.inputHint}>Please enter a valid email that has not already been used. </Text>

                    <Text style={styles.label}>Password: </Text>
                    <TextInput style={[styles.input, this.pickStyle(FIELDS.PASSWORD)]}
                        secureTextEntry={true}
                        onChange={(e) => { this.setState({ password: e.nativeEvent.text }) }}
                        placeholder="Enter Password"
                    />
                    <Text style={styles.inputHint}>Your password must be 8+ characters long and have an at least one of each uppercase, lowercase and special characters. </Text>

                    <Text style={styles.label}>Confirm Password: </Text>
                    <TextInput style={[styles.input, this.pickStyle(FIELDS.CONFIRM_PASSWORD)]}
                        secureTextEntry={true}
                        onChange={(e) => { this.setState({ confirmPassword: e.nativeEvent.text }) }}
                        placeholder="Confirm Password"
                    />
                    <Text style={styles.inputHint}>Please re-enter you password</Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.registerPressed}
                    >
                        <Text> Register </Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.hint}> Do you already have an account? </Text>
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => { this.props.navigation.navigate('Login') }}
                >
                    <Text> Login </Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}

export default Register;

const styles = StyleSheet.create({
    header: {
        color: "#1A1A0F",
        textAlign: 'center',
        fontSize: 30,
        paddingBottom: 10,
        marginBottom: 10,
        marginTop: 20
    },
    label: {
        color: "#1A1A0F",
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5
    },
    hint: {
        color: "#74776B",
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        padding: 15,
        backgroundColor: "#F8F8F2"
    },
    inputHint: {
        color: "#757575",
        marginTop: 2,
        marginBottom: 10,
        padding: 5,
        fontSize: 15
    },
    input: {
        padding: 10,
        fontSize: 15,
        borderWidth: 1
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
        padding: 20
    }
});

