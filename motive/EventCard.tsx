import { Component } from 'react';

import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Profile } from '../util/Profile';
import MotiveHelper, { Attendance, Motive } from '../util/MotiveHelper';

type PropType = {
    motive: Motive,
    owner: boolean,
    openMotive: (motive: Motive, owner: boolean) => void

}

type StateType = {
    attendance: Attendance | null,
    hasAttendance: boolean,
    loading: boolean,
    expanded: false,
}
class EventCard extends Component<PropType, StateType>{
    state: StateType = { attendance: null, loading: true, hasAttendance: false, expanded: false };
    helper: MotiveHelper;

    constructor(props: PropType) {
        super(props);
        this.helper = new MotiveHelper(this.props.motive, this)
    }

    componentDidMount(): void {
        this.helper.loadMyAttendance();
    }


    public getRequestCount() {
        if (this.props.owner) {
            return <View style={{ marginRight: 15 }}><Text>✋ Requests <Text style={{ color: 'red', fontWeight: 'bold' }}> •  {this.props.motive.managementDetails.requests.length}</Text></Text></View>
        }
    }
    render() {
        let motive = this.props.motive;

        return <View style={{ width: '95%', borderWidth: 1, borderColor: '#E2E2E2', marginTop: 20, borderRadius: 10 }}>
            <TouchableOpacity onPress={() => { this.props.openMotive(this.props.motive, this.props.owner) }}>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between' }}>
                    <View style={{ margin: 5, width: "50%" }}>{<Profile imageUrl={"https://source.unsplash.com/random/?portrait"} username={motive.ownerUsername} />}</View>
                </View>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', padding: 20, borderTopWidth: 1, borderColor: '#E2E2E2' }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10 }}>{motive.title}</Text>
                    <View style={{ borderRadius: 5, marginBottom: 10 }}>
                        <View style={{ height: 4, backgroundColor: '#69FFAA', width: '100%' }}></View>
                        <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: 'bold', margin: 10 }}>{MotiveHelper.formatTimeAndDate(motive.start)}</Text></View>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, flexDirection: 'row', marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ marginRight: 15 }}><Text>👥 Friends<Text style={{ color: 'red', fontWeight: 'bold' }}> • {motive.attendance.length}</Text> </Text></View>
                            <View style={{ marginRight: 20 }}><Text>😀 Total <Text style={{ color: 'red', fontWeight: 'bold' }}> •  {motive.attendance.length}</Text></Text></View>
                            {this.getRequestCount()}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    }

}

export default EventCard;
