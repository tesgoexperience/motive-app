import { Component } from 'react';

import { ScrollView, View, Text, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import EventCard from './EventCard';
import Api from '../util/helpers/Api';
import { Loading } from '../util/Loading'
import { CreateStatus } from '../status/CreateStatus';
import { Status, StatusCard } from '../status/StatusCard';
import { Motive } from '../util/helpers/MotiveHelper';

enum VIEW {
    ALL = 'all',
    ATTENDING = 'attending',
    PAST = 'past'
}

type Stats = {
    attending: number,
    finished: number,
    all: number
}

type StateType = {
    refreshingViaPulldown: boolean,
    browseMotives: Array<Motive>,
    manageMotives: Array<Motive>,
    pastMotives: Array<Motive>,
    statusList: Array<Status>
    view: VIEW,
    loading: boolean,
    stats: Stats | null
}

class Browse extends Component<{ openMotive: (motive: Motive, owner: boolean) => void, navigator: any }, StateType>{

    state: StateType = { refreshingViaPulldown: false, statusList: [], pastMotives: [], browseMotives: [], manageMotives: [], view: VIEW.ALL, loading: true, stats: null }

    componentDidMount() {
        this.getItems();
    }

    getItems = (view: VIEW = VIEW.ALL) => {
        let numberOfItems: number = 4;


        this.setState({ loading: numberOfItems > 0, browseMotives: [], pastMotives: [], manageMotives: [], statusList: [], stats: null });

        Api.get('/motive/' + view).then((res) => {
            numberOfItems--;

            this.setState({ loading: numberOfItems > 0, browseMotives: res.data });
        });

        // get the stats also
        Api.get('/motive/stats').then((statsRes) => {
            numberOfItems--;
            this.setState({ loading: numberOfItems > 0, stats: statsRes.data });
        });

        Api.get('/motive/managing').then((res) => {
            numberOfItems--; this.setState({ loading: numberOfItems > 0, manageMotives: res.data });
        });

        Api.get('/status/').then((res) => {
            numberOfItems--;
            this.setState({ loading: numberOfItems > 0, statusList: res.data });
        });
    }

    changeView(view: VIEW) {
        this.setState({ view: view });
        this.getItems(view);
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

        let motiveManage;
        let statusList;
        let createStatus;

        if (this.state.view != VIEW.PAST) {
            motiveManage = this.state.manageMotives.map(motive => { return <EventCard openMotive={this.props.openMotive} key={motive.id} owner={true} motive={motive} /> })
            statusList = this.state.statusList.map(status => { return <StatusCard key={status.id} navigator={this.props.navigator} status={status} /> })
            createStatus = <CreateStatus refresh={this.getItems} />;
        }

        let motivesBrowse = this.state.browseMotives.map(motive => { return <EventCard openMotive={this.props.openMotive} key={motive.id} owner={false} motive={motive} /> })

        return < ScrollView refreshControl={< RefreshControl refreshing={this.state.refreshingViaPulldown} onRefresh={() => {
            this.setState({ refreshingViaPulldown: true });
            this.getItems(this.state.view);
            this.setState({ refreshingViaPulldown: false });
        }} />} showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingTop: 20 }}>
            < View style={{ width: '100%', flexDirection: "row", justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => this.changeView(VIEW.ALL)} style={[styles.ViewButton, this.pickBorder(VIEW.ALL)]}><Text style={{ textAlign: 'center' }}>All<Text style={{ color: 'red', fontWeight: 'bold' }}> • {this.state.stats?.all}</Text></Text></TouchableOpacity>
                <TouchableOpacity onPress={() => this.changeView(VIEW.ATTENDING)} style={[styles.ViewButton, this.pickBorder(VIEW.ATTENDING)]}><Text style={{ textAlign: 'center' }}>Attending<Text style={{ color: 'red', fontWeight: 'bold' }}> • {this.state.stats?.attending}</Text></Text></TouchableOpacity>
                <TouchableOpacity onPress={() => this.changeView(VIEW.PAST)} style={[styles.ViewButton, this.pickBorder(VIEW.PAST)]}><Text style={{ textAlign: 'center' }}>past
                    <Text style={{ color: 'red', fontWeight: 'bold' }}> • {this.state.stats?.finished}</Text></Text></TouchableOpacity>
            </View >
            {createStatus}
            {statusList}
            {motiveManage}
            {motivesBrowse}
        </ScrollView >
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
