
import React, { Component } from 'react';

import { StatusBar } from 'expo-status-bar';
import { Alert, processColor, RefreshControl, ScrollView, StyleSheet, Text, View, ViewStyle, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Loading } from '../util/Loading';
import Friend from '../friend/Friend';
import { buttonNeutral } from '../util/GeneralStyles';
import { RootStackParams } from '../navigation/RootStackParams';
import { ThemeColors } from 'react-navigation';
import AuthUtils from '../util/AuthUtils';
import Browse from '../browse/Browse';

const Stack = createNativeStackNavigator<RootStackParams>();

// TODO investigate speed problem
type PropType = {
    navigation: NativeStackNavigationProp<RootStackParams, "Home">,
    reauthenticateApp: any
};

enum MENU_OPTIONS {
    FRIENDS = 'Friends',
    More = 'More',
    NOTIFICATION = 'Alerts',
    NEW_EVENT = 'Share motive'
}

type StateType = {
    refreshing: boolean
}
class Home extends Component<PropType, StateType>{
    state: StateType = { refreshing: false }

    /**
     *
     */
    constructor(props: PropType) {
        super(props);
    }

    public navigate(location: string) {
        if (location == MENU_OPTIONS.FRIENDS) {
            this.props.navigation.navigate('Friends');
        }
    }

    public optionButton(text: string, color?: string) {
        //TODO create a profile page with a logout option. This is tmp solution
        if (text == MENU_OPTIONS.More) {
            return <TouchableOpacity onPress={() => {
                AuthUtils.logout();
                this.props.reauthenticateApp()
            }
            } style={[buttonNeutral]}><Text>{text}</Text></TouchableOpacity>
        }

        if (color != undefined) {
            let bg = { backgroundColor: color }
            return <TouchableOpacity style={[buttonNeutral, bg]}><Text>{text}</Text></TouchableOpacity>
        }
        return <TouchableOpacity onPress={() => this.navigate(text)} style={buttonNeutral}><Text>{text}</Text></TouchableOpacity>

    }

    public render() {
        return <View style={styles.container}>
            <View style={styles.navbar}>
                {this.optionButton(MENU_OPTIONS.NEW_EVENT, '#94ffb0')}
                {this.optionButton(MENU_OPTIONS.NOTIFICATION)}
                {this.optionButton(MENU_OPTIONS.FRIENDS)}
                {this.optionButton(MENU_OPTIONS.More)}
            </View>
            <Browse />
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    navbar: {
        padding: 5,
        paddingBottom: 10,
        marginTop: 10,
        marginEnd: 5,
        borderColor: '#E2E2E2',
        borderBottomWidth: 1,
        flexDirection: "row",
        color: "#1A1A0F",
        justifyContent: 'space-evenly'
    }
});
export default Home