import { Component } from 'react';

import { Alert, Keyboard, Platform, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Login from './Auth/Login';
import Register from './Auth/Register';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParams } from './util/RootStackParams';
import AuthUtils, { ResponseType, UserAuthDetails } from './util/AuthUtils'
import { Loading } from './util/Loading';
import Friend from './friend/Friend';
import Home from './Home/Home';
import { decode, encode } from 'base-64'
import AddFriend from './friend/AddFriend';
import NewMotive from './motive/NewMotive';
import ViewMotive from './motive/ViewMotive';
// import { MenuProvider } from 'react-native-popup-menu';
import UsersList from './util/UserList';


const Stack = createNativeStackNavigator<RootStackParams>();
type MyState = {
    loading: boolean,
    userDetails: UserAuthDetails | null,
    authenticated: boolean
};

// https://github.com/axios/axios/issues/2235
if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

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
                this.setState({ loading: false });
            }
        }
        ).catch(err => {
            this.setState({ loading: false });
        })
    }
    public render() {
        if (this.state.loading) {
            return <Loading />
        }
        let show;
        if (!this.state.authenticated) {

            show = (

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


            );
        } else {
            show = <NavigationContainer independent={true}>
                <Stack.Navigator screenOptions={{
                    headerShown: false,
                    header: () => null,
                    contentStyle: { backgroundColor: 'white', padding: 20, paddingTop: 30 },
                }}>
                    <Stack.Screen name="Home">
                        {(props) => <Home {...props} reauthenticateApp={this.authenticate} />}
                    </Stack.Screen>
                    <Stack.Screen name="Friends" component={Friend} />
                    <Stack.Screen name="AddFriend" component={AddFriend} />
                    <Stack.Screen name="NewMotive" component={NewMotive} />
                    <Stack.Screen name="ViewMotive" component={ViewMotive} />
                    <Stack.Screen name="ListUsers" component={UsersList} />
                </Stack.Navigator>
            </NavigationContainer>

        }

        // return (<MenuProvider><View style={styles.container}>{show}</View></MenuProvider>)
        return (<View style={styles.container}>{show}</View>)

    }
}

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});


