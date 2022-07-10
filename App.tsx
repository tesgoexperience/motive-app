import React, { Component } from 'react';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Login from './Auth/Login';
import Register from './Auth/Register';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParams } from './navigation/RootStackParams';
import { setItemAsync, getItemAsync } from 'expo-secure-store';

const Stack = createNativeStackNavigator<RootStackParams>();

type MyState = {
    loading: boolean,
    userDetails: any
};

class App extends Component<{}, MyState>{

    state: MyState = { loading: true, userDetails: null };

    public componentDidMount() {

        getItemAsync("user").then((e) => {
            this.setState({ loading: false, userDetails: e });
        }).catch(e => {
            console.log(e);
            this.setState({ loading: false, userDetails: null });
        });
    }
    public render() {

        if (this.state.loading) {
            return <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>Loading ....</Text>
            </View>
        }

        if (!this.state.userDetails) {
            return (
                <View style={styles.container}>
                    <NavigationContainer>
                        <Stack.Navigator initialRouteName='Home' screenOptions={{
                            headerShown: false,
                            header: () => null,
                            contentStyle: { backgroundColor: 'white' },
                        }}>
                            <Stack.Screen name="Register" component={Register} />
                            <Stack.Screen name="Login" component={Login} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </View>
            );
        }
    }
}

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: "10%",
        marginTop: "50%",
        backgroundColor: '#FFFFF',
        content: 'center',
        color: "#1A1A0F"
    },
});
