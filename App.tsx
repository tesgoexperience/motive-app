import React, { Component } from 'react';

import {StyleSheet, View } from 'react-native';
import Login from './Auth/Login';
import Register from './Auth/Register';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import { RootStackParams } from './navigation/RootStackParams';
import AuthUtils, { ResponseType, User } from './util/AuthUtils'
import { Loading } from './util/Loading';
import Friend from './friend/Friend';
import Home from './Home/Home';
import AddFriend from './friend/AddFriend';
const Stack = createNativeStackNavigator<RootStackParams>();

type MyState = {
    loading: boolean,
    userDetails: User | null,
    authenticated: boolean
};

class App extends Component<{}, MyState>{

    state: MyState = { loading: true, userDetails: null, authenticated: false };

    public componentDidMount() {
        this.authenticate();
    }

    public authenticate = () => {

        this.setState({ loading: true, authenticated: false })

        AuthUtils.attemptAuthentication().then(res => {
            if (res == ResponseType.OK) {
                // since they are logged in, get their user details
                AuthUtils.getStoredUser().then(user => {
                    this.setState({ loading: false, userDetails: user, authenticated: true });
                })

            } else {
                this.setState({ loading: false});
            }
        }
        ).catch(err => {
            this.setState({ loading: false});
        })
    }
    public render() {
        if (this.state.loading) {
            return <Loading />
        }

        if (!this.state.authenticated) {
            return (

                <View style={styles.container}>
                    <NavigationContainer independent={true}>
                        <Stack.Navigator screenOptions={{
                            headerShown: false,
                            header: () => null,
                            contentStyle: { backgroundColor: 'white' },

                        }}>
                            {/* the {...props} passes in props from stack screen like navigation */}
                            <Stack.Screen name="Login">
                                {(props) => <Login {...props} reauthenticateApp={this.authenticate} />}
                            </Stack.Screen>
                            <Stack.Screen name="Register">
                                {(props) => <Register {...props} reauthenticateApp={this.authenticate} />}
                            </Stack.Screen>
                        </Stack.Navigator>
                    </NavigationContainer>
                </View>

            );
        } else {
            return <View style={styles.container}>
                <NavigationContainer independent={true}>
                    <Stack.Navigator screenOptions={{
                        headerShown: false,
                        header: () => null,
                        contentStyle: { backgroundColor: 'white' },

                    }}>
                        <Stack.Screen name="Home">
                                {(props) => <Home {...props} reauthenticateApp={this.authenticate} />}
                            </Stack.Screen>
                        <Stack.Screen name="Friends" component={Friend} />
                        <Stack.Screen name="AddFriend" component={AddFriend} />

                    </Stack.Navigator>
                </NavigationContainer>
            </View>


        }

    }
}

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 15,
        marginTop: 30
    },
    content_container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: '#FFFFF',
        content: 'center',
        color: "#1A1A0F",
    },
    navbar: {
        flex: 1,
        padding: 5,
        marginTop: 20,
        flexDirection: "row",
        color: "#1A1A0F",
        justifyContent: 'space-evenly'
    }
});
