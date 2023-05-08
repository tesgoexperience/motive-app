import { Component } from "react";

import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import Api from "../util/Api";
import { Loading } from "../util/Loading";
import { Profile } from "../util/Profile";
import { CommonStyle } from "../util/Styles";
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
        ).catch((err) => {

            if (err.response.data == 'You cannot request yourself.') {
                Alert.alert('You cannot request yourself....weird');
                this.setState({ loading: false });

            }
        });
    }

    public renderActionButton() {
        let removeButton = <TouchableOpacity onPress={() => this.changeRelation(USER_ACTIONS.REMOVE_FRIEND)} style={[styles.button, CommonStyle.redBorder]}><Text>Remove</Text></TouchableOpacity>;
        switch (this.props.relation) {
            case FRIEND_RELATION.REQUESTED_BY_THEM:
                return <>
                    <TouchableOpacity onPress={() => this.changeRelation(USER_ACTIONS.ACCEPT)} style={[styles.button, CommonStyle.greenBorder]}><Text>Accept</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.changeRelation(USER_ACTIONS.REJECT)} style={[styles.button, CommonStyle.redBorder]}><Text>Reject</Text></TouchableOpacity>
                </>
            case FRIEND_RELATION.FRIEND:
                return removeButton;
            case FRIEND_RELATION.REQUESTED_BY_YOU:
                return removeButton;
            case FRIEND_RELATION.NO_RELATION:
                return <TouchableOpacity onPress={() => this.changeRelation(USER_ACTIONS.REQUEST)} style={[styles.button, CommonStyle.greenBorder]}><Text>Request</Text></TouchableOpacity>
        }
    }

    public render() {

        if (this.state.loading) {
            return <View style={styles.userContainer}><Loading /></View>
        }

        return (<View style={styles.userContainer}>
            <View style={{ width: "60%" }}><Profile username={this.props.username} /></View>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: "flex-end", alignItems: "flex-end", width: '40%' }}>
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
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 20,
        width: '100%',
        borderColor: 'lightgray',
        borderBottomWidth: 1
    },
    button: {
        paddingEnd: 10,
        paddingStart: 10,
        justifyContent: 'center',
        marginRight: 10,
        height: 40
    },
});