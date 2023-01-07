import React, { Component } from "react";

import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from "react-native";
import { Profile } from "./Profile";

type PropType = {
    userList: Map<string, boolean>,
    title: string,
    cancel: () => void,
    done: (userList: Map<string, boolean>) => void
}

type StateType = {
    userList: Map<string, boolean>
}

class UserSelect extends Component<PropType, StateType> {
    state: StateType = { userList: this.props.userList };

    constructor(props: PropType) {
        super(props);

    }

    toggleUser(username: string) {
        this.setState({ userList: this.state.userList.set(username, !this.state.userList.get(username)) });
    }

    getNumberOfSelected() {
        let count = 0;

        this.state.userList.forEach((v, k) => {
            if (v) {
                count++;
            }
        });

        return count;
    }
    renderUserList() {

        let usersListArray = Array.from(this.state.userList.keys());

        return <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>{usersListArray.map((k) => {
            let text = <View style={{ marginLeft: 20 }}><Profile username={k} /></View>
            let button;

            if (this.state.userList.get(k)) {
                button = <TouchableOpacity style={[styles.button, { backgroundColor: '#94ffb0', borderColor: '#94ffb0' }]} onPress={() => this.toggleUser(k)} />
            }
            else {
                button = <TouchableOpacity style={styles.button} onPress={() => this.toggleUser(k)} />
            }

            return <View key={k} style={{ marginTop: 20, flex: 1, flexDirection: "row", justifyContent: 'flex-start', alignItems: 'center' }}>{button}{text}</View>;
        })}</ScrollView>

    }

    public render() {
        return < View style={{ marginTop: 40, paddingBottom: 30 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'left', marginBottom: 20 }}>{this.props.title}<Text style={{ color: 'red', fontWeight: 'bold' }}> • {this.getNumberOfSelected()}</Text></Text>
            <View style={{ width: '95%', flexDirection: "row", justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#E2E2E2', paddingBottom: 10 }}>
                <TouchableOpacity style={{ width: '45%', borderWidth: 1, borderRadius: 5, padding: 8, borderColor: '#69FFAA' }}><Text onPress={() => this.props.done(this.state.userList)} style={{ textAlign: 'center', fontWeight: '600' }}>Done</Text></TouchableOpacity>
                <TouchableOpacity style={{ width: '45%', borderWidth: 1, borderRadius: 5, padding: 8, borderColor: '#ff4d4d' }}><Text onPress={() => this.props.cancel()} style={{ textAlign: 'center', fontWeight: '600' }}>Cancel</Text></TouchableOpacity>
            </View>
            {this.renderUserList()}
        </View>
    }
}

const styles = StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 10,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#E2E2E2'
    }
});

export default UserSelect;