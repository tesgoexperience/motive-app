import React, { Component } from "react";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../navigation/RootStackParams";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity} from "react-native";
import { Searchbar} from 'react-native-paper';
import Api from "../util/Api";
import { Loading } from "../util/Loading";
import { buttonNeutral, goodBackground } from '../util/GeneralStyles';
import FriendCard from "./FriendCard";
import FRIEND_RELATION from "./FriendRelation";

type PropType = {
    navigation: NativeStackNavigationProp<RootStackParams, "AddFriend">;
};

type User = {
    username: string,
    relation: FRIEND_RELATION
}

type StateType = {
    searchTerm: string,
    results: Array<User>,
    loading: boolean
}

class AddFriend extends Component<PropType, StateType> {
    state: StateType = { searchTerm: '', loading: false, results: [] };

    constructor(props: PropType) {
        super(props);
        this.refresh = this.refresh.bind(this);
    }

    public refresh() {
        this.setState({loading: true })
        Api.get('/friendship/search?search=' + this.state.searchTerm).then(r => {

            // convert the string relation property into an enum
            const users: Array<User> = r.data.map((element: any) => {
                const relationKey: keyof typeof FRIEND_RELATION = element.relation;
                return { username: element.username, relation: FRIEND_RELATION[relationKey] }
            })

            // if by the time this query is
            this.setState({ results: users, loading: false })
        }).catch(err => {
            console.log(err);
        });
    }

    public renderResults() {
        if (this.state.loading) {
            return <View style={{ marginTop: 50 }}><Loading /></View>
        }

        if (this.state.results.length == 0) {
            return <View style={{justifyContent: "center" }}><Text style={{ textAlign: "center" }}>No results</Text></View>
        }

        let resultList = <View>{this.state.results.map((user: User) => {
            return (<FriendCard key={user.username} parentRefresh={this.refresh} relation={user.relation} username={user.username} />)
        })}</View>;

        return resultList;
    }

    public render() {
        return <View style={{ paddingTop: 10 }}>
            <View style={{
                flex: 1,
                flexDirection: "row"
            }}>
                <Searchbar
                    placeholder=""
                    onChangeText={(v) => {this.setState({searchTerm: v})}}
                    value={this.state.searchTerm}
                    style={{ width: "70%", height: 50 }}
                />
                <TouchableOpacity onPress={()=>{this.refresh()}} style={[buttonNeutral,goodBackground, { width: "25%", height: 50, padding:5, marginLeft: 5, justifyContent: 'center' }]}><Text style={{textAlign: 'center', fontWeight: 'bold'}}>Search</Text></TouchableOpacity>
            </View>

            <ScrollView style={styles.resultsView}>
                {this.renderResults()}
            </ScrollView>
        </View>
    }
}

export default AddFriend;

const styles = StyleSheet.create({
    resultsView: {
        marginTop: 60,
        padding: 10
    }
});