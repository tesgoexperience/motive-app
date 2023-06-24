import React, { Component } from "react";

import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { Profile } from "./Profile";
import { RootStackParams } from "./RootStackParams";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { BackButton } from "./BackButton";

type PropType = {
    navigation: NativeStackNavigationProp<RootStackParams, "ViewMotive">;
    route: any
}

type StateType = {
    users: Array<string>,
    title: string
}


class UsersList extends Component<PropType, StateType> {
    state: StateType = {users: this.props.route.params.users, title:this.props.route.params.title };

    public render() {
        return < View style={{ marginTop: 40, paddingBottom: 30 }}>
            {<BackButton navigation={this.props.navigation} />}
            <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'left', marginBottom: 20 }}>{this.state.title}<Text style={{ color: 'red', fontWeight: 'bold' }}> • {this.state.users.length}</Text></Text>
            <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>{this.state.users.map((k) => {
                return <View key={k} style={{ marginTop: 20, flex: 1, flexDirection: "row", justifyContent: 'flex-start', alignItems: 'center' }}><Profile username={k} /></View>;
            })}</ScrollView>
        </View>
    }
}


export default UsersList;