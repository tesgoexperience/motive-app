import React, { Component } from 'react';
import { TextInput, Text, View, StyleSheet, TextStyle, ViewStyle, TouchableOpacity, GestureResponderEvent, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../navigation/RootStackParams';
import Api from '../util/Api'
import AuthUtil, {ResponseType, User} from '../util/AuthUtils'
import { AuthError } from '../util/Errors';
import App from '../App';
import AuthUtils from '../util/AuthUtils';

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
    loading: boolean,
    finished: boolean
};

type MyProps = {
    navigation: NativeStackNavigationProp<RootStackParams, 'Login'>
};

class Register extends Component<MyProps, MyState>{

    state: MyState = { user: { username: "", password: "", email: "" }, confirmPassword: "", errors: new Array(), loading: false, finished: false };
    private readonly POST_REGISTRATION_AUTH_FAILED: string = "Post registration login attempt failed.";

    private addError(f: FIELDS): void {

        if (this.state.errors.includes(f))
            return;

        let errs = this.state.errors;

        errs.push(f);
        this.setState({ errors: errs });
    }

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
                        this.setState({ finished: true })
                    }
                    else {
                        throw new AuthError(this.POST_REGISTRATION_AUTH_FAILED);
                    }
                })
            }).catch(err => {
                this.setState({ loading: false });
                //TODO email already being used error
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

        if (this.state.finished) {
            return <App />;
        }

        if (this.state.loading) {
            return <ScrollView style={styles.view}>
                <Text style={styles.header}> Loading </Text>
            </ScrollView>
        }

        return (
            <ScrollView style={styles.view}>
                <Text style={styles.header}> Register </Text>
                <View >
                    <Text style={styles.label}>Username: </Text>
                    <TextInput style={[styles.input, this.pickStyle(FIELDS.USERNAME)]} onChange={(e) => { this.setState({ user: { ...this.state.user, username: e.nativeEvent.text } }) }} placeholder="Enter Username" />
                    <Text style={styles.inputHint}>Pick a unique username. Must be 5+ chars</Text>

                    <Text style={styles.label}>Email: </Text>
                    {/* if email is taken show alert */}
                    <TextInput style={[styles.input, this.pickStyle(FIELDS.EMAIL)]} onChange={(e) => { this.setState({ user: { ...this.state.user, email: e.nativeEvent.text } }) }} placeholder="Enter Email" />
                    <Text style={styles.inputHint}>Please enter a valid email that has not already been used. </Text>

                    <Text style={styles.label}>Password: </Text>
                    <TextInput style={[styles.input, this.pickStyle(FIELDS.PASSWORD)]}
                        secureTextEntry={true}
                        onChange={(e) => { this.setState({ user: { ...this.state.user, password: e.nativeEvent.text } }) }}
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

