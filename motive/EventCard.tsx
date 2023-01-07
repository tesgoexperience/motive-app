import { Component } from 'react';

import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Api from '../util/Api';
import { Loading } from '../util/Loading';
import { Profile } from '../util/Profile';
import { CommonStyle } from "../util/Styles";
import AuthUtils from '../util/AuthUtils';

export type MotiveBrowse = {
    ownerUsername: string,
    title: string,
    description: string,
    start: number,
    id: string,
    confirmedAttendanceAnonymous: number,
    confirmedAttendance: Array<string>,
    createdOn: number
}

export type MotiveManage = MotiveBrowse & {
    requests: Array<string>,
    SpecificallyInvited: Array<string>
}

export type Motive =  MotiveManage | MotiveBrowse;

type Attendance = {
    status: string,
    user: string,
    anonymous: boolean,
    id: string,
}

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

    private formatDate(unix_timestamp: number): string {
        let date = new Date(unix_timestamp);
        let addZero = (val: number) => { return val < 10 ? "0" + val : val }
        return date.getDate() + "/" + addZero(date.getMonth() + 1) + "/" + addZero(date.getFullYear()) + "  " + addZero(date.getHours()) + ":" + addZero(date.getMinutes());
    }

    componentDidMount(): void {
        this.loadAttendance();
    }

    private loadAttendance() {
        this.setState({ loading: true });

        Api.get('/attendance/?motiveId=' + this.props.motive.id).then((res) => {
            if (res.data == '' || res.data == null) {
                this.setState({ loading: false, hasAttendance: false });
            } else {
                this.setState({ loading: false, attendance: res.data, hasAttendance: true });
            }
        })
    }
    private cancelAttendance() {
        this.setState({ loading: true });
        Api.post('/attendance/cancel', this.props.motive.id).then(() => {
            this.loadAttendance();
        });
    }

    private requestAttendance(anonymous: boolean) {
        this.setState({ loading: true });
        Api.post('/attendance/request', { motive: this.props.motive.id, anonymous: anonymous }).then((res) => {
            this.loadAttendance();
        });
    }

    private getOptions() {

        if (this.state.loading) {
            return <View style={{ width: '30%', borderRadius: 5, padding: 8, marginRight: 5 }}><Loading /></View>
        }

        if (this.props.owner) {
            return <TouchableOpacity onPress={() => this.requestAttendance(false)} style={{ width: '30%', borderRadius: 5, padding: 8, marginRight: 5, backgroundColor: '#69FFAA' }}><Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Edit</Text></TouchableOpacity>
        }

        if (!this.state.hasAttendance) {
            return <><TouchableOpacity onPress={() => this.requestAttendance(false)} style={{ width: '30%', borderRadius: 5, padding: 8, marginRight: 5, backgroundColor: '#69FFAA' }}><Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Join</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => this.requestAttendance(true)} style={{ width: '10%', borderRadius: 5, padding: 8, backgroundColor: '#69FFAA' }}><Text style={{ textAlign: 'center', fontWeight: 'bold' }}>🕵️</Text></TouchableOpacity></>
        }

        let incognitoIcon;
        if (this.state.attendance?.anonymous) {
            incognitoIcon = <TouchableOpacity style={{ width: '10%', borderRadius: 5, padding: 8 }}><Text style={{ textAlign: 'center', fontWeight: 'bold' }}>🕵️</Text></TouchableOpacity>;
        }

        return <><Text style={{ borderWidth: 1, borderRadius: 5, padding: 8, marginRight: 5, color: '#c7c7c7', borderColor: '#e7e7e7' }}>{this.state.attendance?.status}</Text><TouchableOpacity onPress={() => this.cancelAttendance()} style={[{ width: '30%', borderRadius: 5, padding: 8, marginRight: 5 }, CommonStyle.redBackground]}><Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Cancel</Text></TouchableOpacity>
            {incognitoIcon}
        </>

    }

    public getAttendeeList() {
        let motive = this.props.motive;

        let anonymous = motive.confirmedAttendanceAnonymous > 0 ? <View style={{ padding: 10, width: '100%', borderBottomColor: '#E2E2E2', borderBottomWidth: 1 }}><Profile username={motive.confirmedAttendanceAnonymous + " Anonymous"} imageUrl={'https://cdn.pixabay.com/photo/2017/04/15/04/36/incognito-2231825_960_720.png'} /></View> : null;

        if (motive.confirmedAttendance.length > 0) {
            return <ScrollView style={{ height: 150, marginTop: 20 }}>
                <View style={{ flex: 1, flexDirection: "column", flexWrap: 'wrap', justifyContent: 'space-around' }}>{motive.confirmedAttendance.map((attendee) => {
                    return <View style={{ padding: 10, width: '100%', borderBottomColor: '#E2E2E2', borderBottomWidth: 1 }}><Profile username={attendee} imageUrl={'https://placeimg.com/500/500'} /></View>
                })}
                    {anonymous}
                </View>
            </ScrollView>
        } else {
            return <ScrollView style={{ height: 20, marginTop: 20 }}>{anonymous}</ScrollView>
        }
    }

    render() {
        let motive = this.props.motive;

        return <View style={{ width: '95%', borderWidth: 1, borderColor: '#E2E2E2', marginTop: 20, borderRadius: 10 }}>
            <TouchableOpacity onPress={() => { this.props.openMotive(this.props.motive, this.props.owner) }}>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between' }}>
                    <View style={{ margin: 5, width: "50%" }}>{<Profile imageUrl={"https://source.unsplash.com/random/?portrait"} username={motive.ownerUsername} />}</View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <View style={{ marginRight: 15 }}><Text>👥 : {motive.confirmedAttendance.length + motive.confirmedAttendanceAnonymous}</Text></View>
                        <View style={{ marginRight: 20 }}><Text>😀 : {motive.confirmedAttendance.length + motive.confirmedAttendanceAnonymous}</Text></View>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', padding: 20, borderTopWidth: 1, borderColor: '#E2E2E2' }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10 }}>{motive.title}</Text>
                    <View style={{ borderRadius: 5, marginBottom: 10 }}>
                        <View style={{ height: 4, backgroundColor: '#69FFAA', width: '100%' }}></View>
                        <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: 'bold', margin: 10 }}>{this.formatDate(motive.start)}</Text></View>
                    {/* {this.getAttendeeList()} */}
                    <View style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'flex-end', marginTop: 20 }}>
                        {this.getOptions()}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    }

}

export default EventCard;
