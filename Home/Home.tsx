
import { Component } from 'react';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {NativeStackNavigationProp } from '@react-navigation/native-stack';
import { buttonNeutral, goodColor } from '../util/GeneralStyles';
import { RootStackParams } from '../navigation/RootStackParams';
import AuthUtils from '../util/AuthUtils';
import Browse from '../motive/Browse';

// TODO investigate speed problem
type PropType = {
    navigation: NativeStackNavigationProp<RootStackParams, "Home">,
    reauthenticateApp: any
};

enum MENU_OPTIONS {
    FRIENDS = 'Friends',
    MORE = 'More',
    NOTIFICATION = 'Alerts',
    NEW_MOTIVE = 'New Motive'
}

type StateType = {
    refreshing: boolean
}

class Home extends Component<PropType, StateType>{
    state: StateType = { refreshing: false }

    constructor(props: PropType) {
        super(props);
    }

    public render() {
        return <View style={styles.container}>
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('NewMotive')} style={[buttonNeutral,goodColor]}><Text>New Motive</Text></TouchableOpacity>
                <TouchableOpacity style={buttonNeutral}><Text>Notifications</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Friends')} style={buttonNeutral}><Text>Friends</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => { AuthUtils.logout(); this.props.reauthenticateApp() }} style={[buttonNeutral]}><Text>More</Text></TouchableOpacity>
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