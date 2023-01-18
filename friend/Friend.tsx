import { Component } from "react";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../util/RootStackParams";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, RefreshControl, BackHandler, Alert } from "react-native";
import Api from "../util/Api";
import { Loading } from "../util/Loading";
import { BackButton } from "../util/BackButton";
import { CommonStyle } from "../util/Styles";
import UserListOptions, { User } from "../util/UserListOptions";

type PropType = {
    navigation: NativeStackNavigationProp<RootStackParams, "Friends">;
};


type StateType = {
    searchTerm: string,
    socialSummary: { requestsSent: Array<string>, requestsReceived: Array<string>, friends: Array<string> },
    loading: boolean,
    showSearchResults: boolean,
    refreshingViaPulldown: boolean
}


enum USER_ACTIONS {
    ACCEPT = '/accept',
    REJECT = '/reject',
    REMOVE_FRIEND = '/remove',
    REQUEST = '/request'

}

class Friend extends Component<PropType, StateType> {
    state: StateType = { searchTerm: '', socialSummary: { requestsSent: [], requestsReceived: [], friends: [] }, loading: true, showSearchResults: false, refreshingViaPulldown: false };

    constructor(props: PropType) {
        super(props);
        this.refresh = this.refresh.bind(this);
    }

    componentDidMount(): void {
        this.refresh();
    }

    refreshPulldown = () => {
        this.setState({ refreshingViaPulldown: true });
        this.refresh();
        this.setState({ refreshingViaPulldown: false });
    }

    public refresh() {
        this.setState({ loading: true });
        Api.get('/friendship/').then(r => {
            this.setState({ socialSummary: r.data, loading: false })
        })
    }

    public changeRelation(username: string, action: USER_ACTIONS) {
        this.setState({ loading: true });
        Api.post('friendship' + action + '?username=' + username).then(() => {
            this.setState({ loading: false });
            this.refresh();
        }
        ).catch((err) => {
            let res = err.response.data;
            if (res.message == 'You cannot request yourself.') {
                Alert.alert('You cannot request yourself....weirdo');
                this.setState({ loading: false });

            }
        });
    }

    public renderFriends() {
        return <View style={{ flex: 0, flexDirection: 'column', justifyContent: 'space-between' }}>
            <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshingViaPulldown} onRefresh={this.refreshPulldown} />} contentContainerStyle={{ height: '100%', paddingTop: 20 }}>
                <View style={{ marginBottom: 50 }}>{<UserListOptions size={1} title="Requests Received" users={this.state.socialSummary.requestsReceived.map(user => { return { username: user, options: [{ color: 'GOOD', onclick: () => this.changeRelation(user, USER_ACTIONS.ACCEPT), title: 'Accept' }, { color: 'BAD', onclick: () => this.changeRelation(user, USER_ACTIONS.REJECT), title: 'Reject' }] } })} />}</View>
                <View style={{ marginBottom: 50 }}>{<UserListOptions size={1} title="Requests Sent" users={this.state.socialSummary.requestsSent.map(user => { return { username: user, options: [{ color: 'BAD', onclick: () => this.changeRelation(user, USER_ACTIONS.REMOVE_FRIEND), title: 'Remove' }] } })} />}</View>
                <View style={{ marginBottom: 50 }}>{<UserListOptions size={1} title="Friends" users={this.state.socialSummary.friends.map(user => { return { username: user, options: [{ color: 'BAD', onclick: () => this.changeRelation(user, USER_ACTIONS.REMOVE_FRIEND), title: 'Remove' }] } })} />}</View>
            </ScrollView></View>

    }

    public render() {

        if (this.state.loading) {
            return <Loading />
        }

        return <View style={{ marginTop: 5 }}>
            {<BackButton navigation={this.props.navigation} />}
            <TouchableOpacity onPress={() => this.props.navigation.navigate('AddFriend')} style={[CommonStyle.greenBorder, CommonStyle.greenBackground, { padding: 10, marginTop: 20, marginBottom: 20 }]}><Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Add/Search People</Text></TouchableOpacity>
            {this.renderFriends()}
        </View>
    }

}

export default Friend

