import { Component } from "react";
import { MotiveManage } from "./EventCard";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { RootStackParams } from "../util/RootStackParams";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BackButton } from "../util/BackButton";
import { Profile } from "../util/Profile";
import UserListOptions from "../util/UserListOptions";

type PropType = {
    navigation: NativeStackNavigationProp<RootStackParams, "ViewMotive">;
    route: any
}

type StateType = {
    motive: MotiveManage, owner: boolean
}
class ViewMotive extends Component<PropType, StateType>{
    state: StateType = { motive: this.props.route.params.motive, owner: this.props.route.params.owner }

    getRequests() {
        if (!this.state.owner) {
            return;
        }
        return <View style={{ marginTop: 25, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'lightgray' }}>{<UserListOptions size={1} title="Requests" users={this.state.motive.requests.map(user => { return { username: user, options: [{ color: 'GOOD', onclick: () => { }, title: 'Accept' }, { color: 'BAD', onclick: () => { }, title: 'Reject' }] } })} />}</View>
    }

    getAttendees() {
        return <View style={{ marginTop: 25, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'lightgray' }}>{<UserListOptions size={1} title="Attendees" users={this.state.motive.confirmedAttendance.map(user => { return { username: user, options: [{ color: 'BAD', onclick: () => { }, title: 'Remove' }] } })} />}</View>
    }

    render() {
        let motive = this.state.motive;
        return <View style={{ flex: 1, flexDirection: 'column' }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
                {<BackButton navigation={this.props.navigation} />}
                <View style={{ flex: 0, marginTop: 20, marginBottom: 10, height: 40, flexDirection: "row", justifyContent: 'space-between' }}>
                    <View style={{ width: '50%' }}>{<Profile imageUrl={"https://source.unsplash.com/random/?portrait"} username={motive.ownerUsername} />}</View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <View style={{ marginRight: 15 }}><Text>👥 : {motive.confirmedAttendance.length + motive.confirmedAttendanceAnonymous}</Text></View>
                        <View style={{ marginRight: 20 }}><Text>😀 : {motive.confirmedAttendance.length + motive.confirmedAttendanceAnonymous}</Text></View>
                    </View>
                </View>
                <View style={{ marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: 'lightgray' }}><Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10 }}>{motive.title}</Text>
                    <Text>{motive.description}</Text>
                </View>
                {this.getRequests()}
                {this.getAttendees()}
            </ScrollView>
            <View style={{ flex: 0, flexDirection: 'row', height: '10%', borderTopColor: 'lightgray', borderTopWidth: 1, paddingTop: 10 }}>
                <TouchableOpacity style={{ width: '70%', marginRight: '5%', borderRadius: 5, padding: 8, backgroundColor: '#69FFAA', height: 50, justifyContent: 'center' }}><Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>Join</Text></TouchableOpacity>
                <TouchableOpacity style={{ width: '25%', borderRadius: 5, padding: 8, backgroundColor: '#69FFAA', height: 50, justifyContent: 'center' }}><Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>🕵️</Text></TouchableOpacity>
            </View>
        </View>
    }
}

export default ViewMotive;