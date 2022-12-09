import React, { Component } from "react";

import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import Api from "../util/Api";
import { badColor, buttonNeutral, goodColor } from "../util/GeneralStyles";
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
        ).catch((err)=>{
            let res = err.response.data;
            if (res.message == 'You cannot request yourself.') {
                Alert.alert('You cannot request yourself....weird');
                this.setState({ loading: false });

            }
        });
    }

    public renderActionButton() {
        let removeButton = <TouchableOpacity onPress={() => this.changeRelation(USER_ACTIONS.REMOVE_FRIEND)} style={[buttonNeutral, badColor, { paddingEnd: 20, paddingStart: 20 }]}><Text style={badColor}>Remove</Text></TouchableOpacity>;
        switch (this.props.relation) {
            case FRIEND_RELATION.REQUESTED_BY_THEM:
                return <>
                    <TouchableOpacity onPress={() => this.changeRelation(USER_ACTIONS.ACCEPT)} style={[buttonNeutral, goodColor, { paddingEnd: 10, paddingStart: 10, marginEnd: 10 }]}><Text style={goodColor}>Accept</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.changeRelation(USER_ACTIONS.REJECT)} style={[buttonNeutral, badColor, { paddingEnd: 10, paddingStart: 10 }]}><Text style={badColor}>Reject</Text></TouchableOpacity>
                </>
            case FRIEND_RELATION.FRIEND:
                return removeButton;
            case FRIEND_RELATION.REQUESTED_BY_YOU:
                return removeButton;
            case FRIEND_RELATION.NO_RELATION:
                 return <TouchableOpacity onPress={() => this.changeRelation(USER_ACTIONS.REQUEST)} style={[buttonNeutral,goodColor, { paddingEnd: 20, paddingStart: 20 }]}><Text style={goodColor}>Request</Text></TouchableOpacity>
        }
    }

    public render() {

        if (this.state.loading) {
            return <View style={styles.userContainer}><Loading /></View>
        }

        return (<View style={styles.userContainer}><Text style={{ fontSize: 15, fontWeight: 'bold', textAlignVertical: "center" }}>{this.props.username}</Text>
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
        paddingTop: 20,
        paddingBottom: 20,
        width: '100%'
    }
});