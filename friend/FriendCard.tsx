import React, { Component } from "react";

import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Api from "../util/Api";
import { bad, badBackground, buttonNeutral, good, goodBackground } from "../util/GeneralStyles";
import { Loading } from "../util/Loading";
import FRIEND_RELATION from "./FriendRelation";

type PropType = {
    username: string,
    relation: FRIEND_RELATION,
    parentRefresh: any

}

type StateType = {
    loading: boolean
}

enum USER_ACTIONS {
    ACCEPT = '/accept',
    REJECT = '/reject',
    REMOVE_FRIEND = '/remove',
    REQUEST = '/request'

}

class FriendCard extends Component<PropType, StateType> {
    state: StateType = { loading: false }

    public changeRelation(action: USER_ACTIONS) {
        this.setState({ loading: true });
        Api.post('friendship' + action + '?username=' + this.props.username).then(() => {
            this.setState({ loading: false });
            this.props.parentRefresh();
        }
        );
    }

    public renderActionButton() {
        let removeButton = <TouchableOpacity onPress={() => this.changeRelation(USER_ACTIONS.REMOVE_FRIEND)}  style={{ borderWidth: 1, borderRadius: 5, padding: 8, borderColor: bad }}><Text style={{ textAlign: 'center'  }}>Remove</Text></TouchableOpacity>

        switch (this.props.relation) {
            case FRIEND_RELATION.REQUESTED_BY_THEM:
                return <>
                    <TouchableOpacity onPress={() => this.changeRelation(USER_ACTIONS.ACCEPT)}  style={{ borderWidth: 1, borderRadius: 5, padding: 8, borderColor: good, marginEnd: 10}}><Text style={{ textAlign: 'center'  }}>Accept</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.changeRelation(USER_ACTIONS.REJECT)} style={{ borderWidth: 1, borderRadius: 5, padding: 8, borderColor: bad }}><Text style={{ textAlign: 'center'  }}>Reject</Text></TouchableOpacity>
                </>
            case FRIEND_RELATION.FRIEND:
                return removeButton;
            case FRIEND_RELATION.REQUESTED_BY_YOU:
                return removeButton;
            case FRIEND_RELATION.NO_RELATION:
                 return <TouchableOpacity onPress={() => this.changeRelation(USER_ACTIONS.REQUEST)} style={[buttonNeutral,goodBackground, { paddingEnd: 20, paddingStart: 20 }]}><Text style={goodBackground}>Request</Text></TouchableOpacity>
        }
    }

    public render() {

        if (this.state.loading) {
            return <View style={styles.userContainer}><Loading /></View>
        }

        return (<View style={styles.userContainer}><Text style={{ fontSize: 15, fontWeight: '400', textAlignVertical: "center" }}>{this.props.username}</Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: "flex-end", width: '100%' }}>
                {this.renderActionButton()}
            </View>
        </View>)
    }
}

export default FriendCard;

const styles = StyleSheet.create({
    userContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#ffffff",
        padding: 20,
        width: '100%'
    }
});