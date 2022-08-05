import React, { Component } from 'react';

import { StatusBar } from 'expo-status-bar';
import { Alert, processColor, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Login from './Auth/Login';
import Register from './Auth/Register';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from './navigation/RootStackParams';
import { setItemAsync, getItemAsync, deleteItemAsync } from 'expo-secure-store';
import AuthUtils, {ResponseType, User} from './util/AuthUtils'
import { Loading  } from './util/Loading';

const Stack = createNativeStackNavigator<RootStackParams>();

type MyState = {
    loading: boolean,
    userDetails: User | null,
    authenticated: boolean
};

type MyProps = {
    navigation: NativeStackNavigationProp<RootStackParams, "Home">;
  };

  class App extends Component<{}, MyState>{

    state: MyState = { loading: true, userDetails: null, authenticated: false };

    public componentDidMount() {
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
            return <Loading/>
        }

        if (!this.state.authenticated) {
            return (
                <View style={styles.container}>
                    <NavigationContainer independent={true}>
                        <Stack.Navigator initialRouteName='Home' screenOptions={{
                            headerShown: false,
                            header: () => null,
                            contentStyle: { backgroundColor: 'white' },
                            
                        }}>
                              <Stack.Screen  name="Login" component={Login}/>
                            <Stack.Screen name="Register" component={Register} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </View>

            );
        }else {
            return <View style={styles.container}>
            <Text style={{ textAlign: 'center' }}> Success </Text>
        </View>
        }
       
    }
}

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: '#FFFFF',
        content: 'center',
        color: "#1A1A0F",
    }
});
