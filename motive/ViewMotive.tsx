import { Component } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { RootStackParams } from "../util/RootStackParams";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BackButton } from "../util/BackButton";
import { Profile } from "../util/Profile";
import UserListOptions from "../util/UserListOptions";
import MotiveHelper, { Attendance} from "../util/MotiveHelper";
import { Loading } from "../util/Loading";
import { colors } from "../util/Styles"
type PropType = {
    navigation: NativeStackNavigationProp<RootStackParams, "ViewMotive">;
    route: any
}

type StateType = {

    owner: boolean,
    loading: boolean,
    hasAttendance: boolean,
    attendance: Attendance | null,

}
class ViewMotive extends Component<PropType, StateType>{
    state: StateType = { hasAttendance: false, owner: this.props.route.params.owner, loading: false, attendance: null }
    helper: MotiveHelper;

    constructor(props: PropType) {
        super(props);
        this.helper = new MotiveHelper(this.props.route.params.motive, this)

    }

    componentDidMount(): void {
        this.helper.loadMyAttendance();
    }
    getRequests() {
        if (!this.state.owner) {
            return;
        }

        return <View style={{ marginTop: 25, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'lightgray' }}>
            {
                <UserListOptions size={1} title="Requests" users={this.helper.motive.requests.map(user => {
                    return {
                        username: user, options: [{ color: 'GOOD', onclick: () => { this.helper.respondToRequest(true, user) }, title: 'Accept' },
                        { color: 'BAD', onclick: () => { this.helper.respondToRequest(false, user) }, title: 'Reject' }]
                    }
                })} />
            }</View>
    }

    getAttendees() {
        if (this.state.owner) {
            return <View style={{ marginTop: 25, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'lightgray' }}>
                {<UserListOptions size={1} title="Attendees"
                    users={this.helper.motive.confirmedAttendance.map(user => { return { username: user, options: [{ color: 'BAD', onclick: () => { this.helper.removeAttendee(user) }, title: 'Remove' }] } })} />
                }</View>
        }
        return <View style={{ marginTop: 25, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'lightgray' }}>
            {<UserListOptions size={1} title="Attendees"
                users={this.helper.motive.confirmedAttendance.map(user => { return { username: user, options: [] } })} />
            }</View>
    }

    private getOptions() {

        if (this.state.loading) {
            return <View style={{ width: '30%', borderRadius: 5, padding: 8, marginRight: 5 }}><Loading /></View>
        }

        if (this.state.owner) {

            return <>
                <TouchableOpacity style={{ width: '45%', borderRadius: 5, padding: 8, backgroundColor: colors.green, height: 50, justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '45%', borderRadius: 5, marginLeft: 10, backgroundColor: colors.red, padding: 8, height: 50, justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>Cancel</Text>
                </TouchableOpacity>
            </>;

        }

        if (!this.state.hasAttendance) {
            return <><TouchableOpacity onPress={() => this.helper.request(false)} style={{ width: '70%', marginRight: '5%', borderRadius: 5, padding: 8, backgroundColor: '#69FFAA', height: 50, justifyContent: 'center' }}><Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>Join</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => this.helper.request(true)} style={{ width: '25%', borderRadius: 5, padding: 8, backgroundColor: '#69FFAA', height: 50, justifyContent: 'center' }}><Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>🕵️</Text></TouchableOpacity></>
        }

        let incognitoIcon;
        if (this.state.attendance?.anonymous) {
            incognitoIcon = <View style={{ flex: 1, width: '20%', borderRadius: 5, padding: 8, height: 50, justifyContent: 'center' }}><Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 35 }}>🕵️</Text></View>;
        }

        return <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
            <View style={{ flex: 2, justifyContent: 'center', height: 50, borderWidth: 1, borderRadius: 5, padding: 8, marginRight: 5, borderColor: '#e7e7e7' }}>
                <Text style={{ color: '#c7c7c7', textAlign: 'center', fontSize: 15 }}>{this.state.attendance?.status}</Text>
            </View>
            {incognitoIcon}
            <View style={{ flex: 2 }}>
                <TouchableOpacity onPress={() =>
                    this.helper.cancel()} style={{ height: 50, borderRadius: 5, marginLeft: 10, backgroundColor: colors.red, padding: 8, justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    }
    render() {
        if (this.state.loading) {
            return <Loading></Loading>
        }
        let motive = this.helper.motive;
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
            <View style={{ flex: 0, flexDirection: 'row', height: '10%', borderTopColor: 'lightgray', borderTopWidth: 1, paddingTop: 10, justifyContent: 'center' }}>
                {this.getOptions()}
            </View>
        </View>
    }
}

export default ViewMotive;