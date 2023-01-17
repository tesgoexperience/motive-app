import { Component } from 'react';

import { ScrollView, View, Text, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import EventCard, { Motive, MotiveBrowse, MotiveManage } from './EventCard';
import Api from '../util/Api';
import { Loading } from '../util/Loading'
import { CreateStatus } from '../status/CreateStatus';
import { Status, StatusCard } from '../status/StatusCard';

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
    browseMotives: Array<MotiveBrowse>,
    manageMotives: Array<MotiveManage>,
    statusList: Array<Status>
    view: VIEW,
    loading: boolean,
    stats: Stats | null
}

class Browse extends Component<{ openMotive: (motive: Motive, owner: boolean) => void, navigator: any }, StateType>{

    state: StateType = { refreshingViaPulldown: false, statusList: [], browseMotives: [], manageMotives: [], view: VIEW.ALL, loading: true, stats: null }

    componentDidMount() {
        this.getMotiveList(VIEW.ALL);
    }


    getMotiveList(view: VIEW) {
        let numberOfItems: number = 4;

        this.setState({ loading: numberOfItems > 0, browseMotives: [], manageMotives: [], statusList: [], stats: null });

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

        let motiveManage = this.state.manageMotives.map(motive => { return <EventCard openMotive={this.props.openMotive} key={motive.id} owner={true} motive={motive} /> })
        let motivesBrowse = this.state.browseMotives.map(motive => { return <EventCard openMotive={this.props.openMotive} key={motive.id} owner={false} motive={motive} /> })
        let statusList = this.state.statusList.map(status => {return <StatusCard navigator={this.props.navigator} status={status}/>})
            return < ScrollView refreshControl = {< RefreshControl refreshing = { this.state.refreshingViaPulldown } onRefresh = {() => {
            this.setState({ refreshingViaPulldown: true });
            this.getMotiveList(this.state.view);
            this.setState({ refreshingViaPulldown: false });
        }
    } />} showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingTop: 20 }}>
        < View style = {{ width: '100%', flexDirection: "row", justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => this.changeView(VIEW.ALL)} style={[styles.ViewButton, this.pickBorder(VIEW.ALL)]}><Text style={{ textAlign: 'center' }}>All<Text style={{ color: 'red', fontWeight: 'bold' }}> • {this.state.stats?.all}</Text></Text></TouchableOpacity>
                <TouchableOpacity onPress={() => this.changeView(VIEW.ATTENDING)} style={[styles.ViewButton, this.pickBorder(VIEW.ATTENDING)]}><Text style={{ textAlign: 'center' }}>Attending<Text style={{ color: 'red', fontWeight: 'bold' }}> • {this.state.stats?.attending}</Text></Text></TouchableOpacity>
                <TouchableOpacity style={[styles.ViewButton, this.pickBorder(VIEW.FINISHED)]}><Text style={{ textAlign: 'center' }}>Finished<Text style={{ color: 'red', fontWeight: 'bold' }}> • 13</Text></Text></TouchableOpacity>
            </View >
            <CreateStatus/>
            {statusList}
        { motiveManage }
        { motivesBrowse }
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
