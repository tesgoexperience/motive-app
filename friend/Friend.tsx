import React, { Component } from "react";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../navigation/RootStackParams";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, RefreshControl, BackHandler, Alert} from "react-native";
import { buttonNeutral } from "../util/GeneralStyles";
import Api from "../util/Api";
import { Loading } from "../util/Loading";
import FriendCard from "./FriendCard";
import FRIEND_RELATION from "./FriendRelation";
import { BackButton } from "../util/BackButton";
import { CommonStyle } from "../util/Styles";

type PropType = {
    navigation: NativeStackNavigationProp<RootStackParams, "Friends">;
};


type StateType = {
    searchTerm: string,
    socialSummary: any,
    loading: boolean,
    showSearchResults: boolean,
    refreshingViaPulldown : boolean
}


class Friend extends Component<PropType, StateType> {
    state: StateType = { searchTerm: '', socialSummary: null, loading: true, showSearchResults: false, refreshingViaPulldown: false };

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

    public renderFriendContainer(users: [], relation: FRIEND_RELATION) {

        let titleText = '';

        switch (relation) {
            case FRIEND_RELATION.REQUESTED_BY_YOU:
                titleText = 'Pending requests'
                break;
            case FRIEND_RELATION.REQUESTED_BY_THEM:
                titleText = 'Friend Requests'
                break;
            case FRIEND_RELATION.FRIEND:
                titleText = 'Friends'
                break;
        }

        let title = <Text style={styles.sectionHeader}>{titleText} <Text style={{ color: 'red', fontWeight: 'bold' }}> • {users.length}</Text></Text>;
        if (users == null || users.length == 0) {
            return <View style={styles.view}>
                {title}
                <Text style={{ marginLeft: 2, padding: 5 }}>No Results</Text>
            </View>
        }

        let friendCards = users.map((username: string) => { return (<FriendCard key={username} parentRefresh={this.refresh} relation={relation} username={username} />) });
        return <View style={styles.view}>
            {title}
            {friendCards}
        </View>

    }
    public renderFriends() {
        return <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshingViaPulldown} onRefresh={this.refreshPulldown}/> } style={styles.resultsView}>
            {this.renderFriendContainer(this.state.socialSummary.requestsRecieved, FRIEND_RELATION.REQUESTED_BY_THEM)}
            {this.renderFriendContainer(this.state.socialSummary.requestsSent, FRIEND_RELATION.REQUESTED_BY_YOU)}
            {this.renderFriendContainer(this.state.socialSummary.friends, FRIEND_RELATION.FRIEND)}
        </ScrollView>
    }

    public render() {

        if (this.state.loading) {
            return <Loading />
        }

        return <View style={{marginTop:5}}>
            {<BackButton navigation={this.props.navigation}/>}
            <TouchableOpacity onPress={() => this.props.navigation.navigate('AddFriend')} style={[CommonStyle.greenBorder, CommonStyle.greenBackground,{padding:10, marginTop:20, marginBottom:20}]}><Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Add/Search People</Text></TouchableOpacity>
            {this.renderFriends()}
        </View>
    }

}

export default Friend

const styles = StyleSheet.create({
    view: {
        marginBottom:30,
        padding: 10,
        paddingTop: 15
    },
    resultsView: {
        padding: 10,
        paddingTop: 15
    },
    sectionHeader: {
        fontWeight: 'bold',
        paddingBottom: 5,
        borderBottomWidth: 2,
        borderBottomColor: '#D3D3D3',
    },
    userContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#ffffff",
        padding: 20,
        width: '100%'
    }
});
