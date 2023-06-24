
import { Component } from 'react';

import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import {NativeStackNavigationProp } from '@react-navigation/native-stack';
import { buttonNeutral, goodColor } from '../util/GeneralStyles';
import { RootStackParams } from '../util/RootStackParams';
import AuthUtils, { UserAuthDetails } from '../util/AuthUtils';
import Browse from '../motive/Browse';
import { Motive } from '../util/MotiveHelper';
import { Loading } from '../util/Loading';
import Api from '../util/Api';

type PropType = {
    navigation: NativeStackNavigationProp<RootStackParams, "Home">,
    reauthenticateApp: any
};

type StateType = {
    refreshing: boolean,
    username: string | undefined
}

class Home extends Component<PropType, StateType>{
    state: StateType = { refreshing: false, username: undefined }

    constructor(props: PropType) {
        super(props);
    }

    componentDidMount(): void {
        Api.get("user/").then(user=>{
            this.setState({username:user.data})
        })
    }

    openMotive = (motive: Motive, owner: boolean )=>{
        this.props.navigation.navigate('ViewMotive', {motive: motive, owner: owner});
    }

    public render() {

        if (this.state.username==undefined) {
            return <Loading/>
        }

        return <View style={styles.container}>
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('NewMotive')} style={[buttonNeutral,goodColor]}><Text>New Motive</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Friends')} style={buttonNeutral}><Text>👥 Friends</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => { AuthUtils.logout(); this.props.reauthenticateApp() }} style={[buttonNeutral]}><Text>⚙️ {this.state.username}</Text></TouchableOpacity>
            </View>
            <Browse navigator={this.props.navigation} openMotive={this.openMotive} />
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