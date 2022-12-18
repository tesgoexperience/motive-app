import React, { Component } from 'react';
import { TextInput, Text, View, StyleSheet, TouchableOpacity, GestureResponderEvent, ScrollView, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../navigation/RootStackParams';
import Api from '../util/Api'
import { ResponseType, User } from '../util/AuthUtils'
import { AuthError } from '../util/Errors';
import AuthUtils from '../util/AuthUtils';
import { Loading } from '../util/Loading';
import { AxiosError } from 'axios';
import { CommonStyle } from '../util/Styles';
enum FIELDS {
    EMAIL,
    PASSWORD,
    USERNAME,
    CONFIRM_PASSWORD
}

type MyState = {
    user: {
        username: string,
        password: string,
        email: string
    },
    confirmPassword: string,
    errors: Array<FIELDS>,
    loading: boolean
};

type MyProps = {
    navigation: NativeStackNavigationProp<RootStackParams, 'Login'>,
    reauthenticateApp: any
};

class Register extends Component<MyProps, MyState>{

    state: MyState = { user: { username: "", password: "", email: "" }, confirmPassword: "", errors: new Array(), loading: false };
    private readonly POST_REGISTRATION_AUTH_FAILED: string = "Post registration login attempt failed.";
    private readonly UNKNOWN_REGISTRATION_ERROR: string = "Registration failed for an unknown error.";
    private readonly UNKNOWN_REGISTRATION_SERVER_ERROR: string = "Unknown server error during registration";

    private registerPressed = (e: GestureResponderEvent): void => {

        let valid = true;
        let errors = new Array<FIELDS>();

        if (this.state.user.username.length < 5) {
            errors.push(FIELDS.USERNAME);
            valid = false;
        }

        // check password has Minimum eight characters, at least one letter, one number and one special character
        if (!this.state.user.password.match("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$")) {
            errors.push(FIELDS.PASSWORD);
            valid = false;
        }

        if (!this.state.user.email.match("^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$")) {
            errors.push(FIELDS.EMAIL);
            valid = false;
        }

        if (this.state.confirmPassword !== this.state.user.password) {
            errors.push(FIELDS.CONFIRM_PASSWORD);
            valid = false;
        }

        if (valid) {

            this.setState({ loading: true });

            Api.post("/user/register", this.state.user).then(res => {
                // since the registration was successful, log the user in with the details provided during registration
                let user: User = { email: this.state.user.email, password: this.state.user.password, accessToken: "" }
                AuthUtils.attemptAuthentication(user).then(res => {
                    if (res == ResponseType.OK) {
                        this.props.reauthenticateApp();
                    }
                    else {
                        throw new AuthError(this.POST_REGISTRATION_AUTH_FAILED);
                    }
                })
            }).catch(err => {
                this.setState({ loading: false });
                if (err instanceof AxiosError) {
                    if (err.response?.status == 409 || err.response?.data == 'User already exists') {
                        Alert.alert('Email is already registered. Login Instead. ');
                    } else {
                        Alert.alert(this.UNKNOWN_REGISTRATION_SERVER_ERROR);

                        throw new AuthError(this.UNKNOWN_REGISTRATION_SERVER_ERROR);

                    }
                } else {
                    throw new AuthError(this.UNKNOWN_REGISTRATION_ERROR);
                }
            });

        } else {
            this.setState({ errors: errors });
        }
    }

    public pickStyle(field: FIELDS) {
        if (this.state.errors.includes(field)) {
            return { borderColor: "red" };
        }
    }

    public render() {

        if (this.state.loading) {
            return <Loading />
        }

        return (
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <ScrollView contentContainerStyle={CommonStyle.formView}>
                    <View >
                        <Text style={CommonStyle.label}>Username: </Text>
                        <TextInput style={[CommonStyle.input, this.pickStyle(FIELDS.USERNAME)]} onChange={(e) => { this.setState({ user: { ...this.state.user, username: e.nativeEvent.text } }) }} placeholder="Enter Username" />
                        <Text style={CommonStyle.hint}>Pick a unique username. Must be 5+ chars</Text>

                        <Text style={CommonStyle.label}>Email: </Text>
                        {/* if email is taken show alert */}
                        <TextInput style={[CommonStyle.input, this.pickStyle(FIELDS.EMAIL)]} onChange={(e) => { this.setState({ user: { ...this.state.user, email: e.nativeEvent.text } }) }} placeholder="Enter Email" />
                        <Text style={CommonStyle.hint}>Please enter a valid email that has not already been used. </Text>

                        <Text style={CommonStyle.label}>Password: </Text>
                        <TextInput style={[CommonStyle.input, this.pickStyle(FIELDS.PASSWORD)]}
                            secureTextEntry={true}
                            onChange={(e) => { this.setState({ user: { ...this.state.user, password: e.nativeEvent.text } }) }}
                            placeholder="Enter Password"
                        />
                        <Text style={CommonStyle.hint}>Your password must be 8+ characters long and have at least one of each uppercase, lowercase and special characters. </Text>

                        <Text style={CommonStyle.label}>Confirm Password: </Text>
                        <TextInput style={[CommonStyle.input, this.pickStyle(FIELDS.CONFIRM_PASSWORD)]}
                            secureTextEntry={true}
                            onChange={(e) => { this.setState({ confirmPassword: e.nativeEvent.text }) }}
                            placeholder="Confirm Password"
                        />
                        <Text style={CommonStyle.hint}>Please re-enter your password</Text>

                        <TouchableOpacity
                            style={[CommonStyle.greenBorder, CommonStyle.greenBackground, { padding: 10, marginTop: 20, marginBottom: 20 }]}
                            onPress={this.registerPressed}
                        >
                            <Text style={{ textAlign: 'center' }}> Register </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[CommonStyle.hint, { color: "#74776B", textAlign: "center", margin: 15 }]}> Do you already have an account? </Text>
                    <TouchableOpacity
                        style={[CommonStyle.greenBorder, CommonStyle.greenBackground, { padding: 10, marginTop: 20, marginBottom: 20 }]}
                        onPress={() => { this.props.navigation.navigate('Login') }}
                    >
                        <Text style={{ textAlign: 'center' }}> Login </Text>
                    </TouchableOpacity>
                </ScrollView>
            </TouchableWithoutFeedback>

        );
    }
}

export default Register;

