import React, { Component } from 'react';

import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'react-native'
import { Profile } from '../util/Profile';
import { randUserName, randProductDescription, randJobTitle, randNumber, randImg } from '@ngneat/falso';

export type Motive = {
    ownerUsername: string,
    attendees?: Array<string>,
    title: string,
    description: string,
    start: Date,
    id: string,
    confirmedAttendanceAnonymous: number,
    confirmedAttendance: Array<string>
}


type PropType = {
    motive: Motive
}

class EventCard extends Component<PropType, {}>{

    render() {
        let motive = this.props.motive;
        let attendeesList = <ScrollView style={{ height: 150, marginTop: 20 }}><View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: 'flex-start' }}>{motive.confirmedAttendance.map((attendee) => {
            return <View style={{ margin: 8, marginTop: 15 }}><Profile imageUrl={'https://placeimg.com/500/500'} /></View>
        })}</View></ScrollView>
        
        return <View style={{ width: '95%', borderWidth: 1, borderColor: '#E2E2E2', marginTop: 20, borderRadius: 10}}>
            
            <View style={{ flex: 1,flexDirection: "row", justifyContent:'space-between'}}>
                <View style={{ margin: 5, width: "50%" }}>{<Profile imageUrl={"https://source.unsplash.com/random/?portrait"} username={motive.ownerUsername} />}</View>
                <View style={{margin:20}}><Text>😀 : {motive.confirmedAttendance.length + motive.confirmedAttendanceAnonymous}</Text></View>
            </View>

            <View style={{ padding: 20, borderTopWidth: 1, borderColor: '#E2E2E2' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{motive.title}</Text>
                <View style={{ borderWidth: 1, borderColor: '#E2E2E2', borderRadius: 5, padding: 10, marginBottom: 10 }}><Text style={{ fontSize: 15, textAlign: 'center' }}>{motive.start}</Text></View>
                <View style={{ borderWidth: 1, borderColor: '#E2E2E2', borderRadius: 5, padding: 5 }}><Text style={{ fontSize: 15 }}>{motive.description}....</Text></View>
                {attendeesList}
                <View style={{ flex: 1, flexDirection: 'row',justifyContent:'flex-end',  marginTop: 20 }}>
                    <TouchableOpacity style={{ width: '30%', borderRadius: 5, padding: 8, marginRight:5, backgroundColor: '#69FFAA' }}><Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Join</Text></TouchableOpacity>
                    <TouchableOpacity style={{ width: '10%', borderRadius: 5, padding: 8, backgroundColor: '#69FFAA' }}><Text style={{ textAlign: 'center', fontWeight: 'bold' }}>🕵️</Text></TouchableOpacity>

                </View>
            </View>
        </View>
    }

}

export default EventCard;
