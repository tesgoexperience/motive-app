import React, { Component } from 'react';

import { ScrollView, View, Text, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import EventCard, { Motive } from './EventCard';
import Api from '../util/Api';
import { Loading } from '../util/Loading'

enum VIEW {
    ALL = 'all',
    ATTENDING = 'attending',
    FINISHED = 'finished'
}

type Stats = {
    attending: number,
    finished: number,
    all: number
}
type StateType = {
    refreshingViaPulldown: boolean,
    motives: Array<Motive>,
    view: VIEW,
    loading: boolean,
    stats: Stats | null
}

class Browse extends Component<{}, StateType>{

    state: StateType = { refreshingViaPulldown: false, motives: [], view: VIEW.ALL, loading: true, stats: null }

    componentDidMount() {
        this.getMotiveList(VIEW.ALL);
    }

    getMotiveList(view: VIEW) {
        this.setState({ loading: true, motives: [] });
        Api.get('/motive/' + view).then((res) => {
            this.setState({ motives: res.data });

            // get the stats also
            Api.get('/motive/stats').then((statsRes) => {
                this.setState({ stats: statsRes.data });
                this.setState({ loading: false });
            });

        });

    }

    changeView(view: VIEW) {
        this.setState({ view: view });
        this.getMotiveList(view);
    }

    pickBorder(field: VIEW) {
        if (field == this.state.view) {
            return { borderColor: '#69FFAA' };
        }
        else {
            return { borderColor: '#E2E2E2' };
        }
    }

    render() {

        if (this.state.loading) {
            return <Loading />
        }

        let motives = this.state.motives.map(motive => { return <EventCard key={motive.id} motive={motive} /> })

        return <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshingViaPulldown} onRefresh={() => {
            this.setState({ refreshingViaPulldown: true });
            this.getMotiveList(this.state.view);
            this.setState({ refreshingViaPulldown: false });
        }} />} showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingTop: 20 }}>
            <View style={{ width: '100%', flexDirection: "row", justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => this.changeView(VIEW.ALL)} style={[styles.ViewButton, this.pickBorder(VIEW.ALL)]}><Text style={{ textAlign: 'center' }}>All<Text style={{ color: 'red', fontWeight: 'bold' }}> • {this.state.stats?.all}</Text></Text></TouchableOpacity>
                <TouchableOpacity onPress={() => this.changeView(VIEW.ATTENDING)} style={[styles.ViewButton, this.pickBorder(VIEW.ATTENDING)]}><Text style={{ textAlign: 'center' }}>Attending<Text style={{ color: 'red', fontWeight: 'bold' }}> • {this.state.stats?.attending}</Text></Text></TouchableOpacity>
                <TouchableOpacity style={[styles.ViewButton, this.pickBorder(VIEW.FINISHED)]}><Text style={{ textAlign: 'center' }}>Finished<Text style={{ color: 'red', fontWeight: 'bold' }}> • 13</Text></Text></TouchableOpacity>
            </View>
            {motives}
        </ScrollView>
    }

}

const styles = StyleSheet.create({
    ViewButton: {
        width: '30%', 
        borderWidth: 1, 
        borderRadius: 5, 
        padding: 8
    }
});

export default Browse;
