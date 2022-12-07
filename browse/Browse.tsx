import React, { Component } from 'react';

import { ScrollView, View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { randUserName, randProductDescription, randJobTitle, randNumber, randImg } from '@ngneat/falso';
import EventCard, { Motive } from './EventCard';
import Api from '../util/Api';
import { plainToInstance } from 'class-transformer';


type StateType = {
    refreshingViaPulldown: boolean,
    motiveList: Array<Motive>
}

class Browse extends Component<{}, StateType>{
    
    state: StateType = { refreshingViaPulldown: false, motiveList: [] }
    
    componentDidMount() {
        this.getMotiveList();
    }

    getMotiveList() {
        let motives : Array<Motive> ;
        Api.get('/motive/').then((res) => {
            this.setState({ motiveList: res.data });
        });
        
    
       
    }
    render() {

        let motives = this.state.motiveList.map(motive => { return <EventCard key={motive.id} motive={motive} /> })
        
        return <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshingViaPulldown} onRefresh={() => {
                this.setState({ refreshingViaPulldown: true });
                this.getMotiveList();
                this.setState({ refreshingViaPulldown: false });
            }} />} showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingTop:20}}>
                <View style={{width:'100%', flexDirection: "row", justifyContent: 'space-between'}}>
                    <TouchableOpacity style={{width:'45%', borderWidth: 1, borderColor: '#69FFAA', borderRadius: 5, padding: 8}}><Text style={{ textAlign: 'center' }}>Not Involved<Text style={{ color: 'red', fontWeight: 'bold' }}> • 13</Text></Text></TouchableOpacity>
                    <TouchableOpacity style={{ width:'45%',borderWidth: 1, borderColor: '#E2E2E2', borderRadius: 5, padding: 8 }}><Text style={{ textAlign: 'center' }}>Involved<Text style={{ color: 'red', fontWeight: 'bold' }}> • 2</Text></Text></TouchableOpacity>
                </View>
                {motives}
            </ScrollView>
    }

}

export default Browse;
