import { Component } from 'react';

import { ScrollView, View, Text, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import EventCard, { Motive, MotiveBrowse, MotiveManage } from './EventCard';
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
    browseMotives: Array<MotiveBrowse>,
    manageMotives: Array<MotiveManage>
    view: VIEW,
    loading: boolean,
    stats: Stats | null
}

class Browse extends Component<{ openMotive : (motive: Motive, owner: boolean) => void }, StateType>{

    state: StateType = { refreshingViaPulldown: false, browseMotives: [], manageMotives: [], view: VIEW.ALL, loading: true, stats: null }

    componentDidMount() {
        this.getMotiveList(VIEW.ALL);
    }

    getMotiveList(view: VIEW) {
        let loadingStats: boolean = true; 
        let loadingBrowseMotives: boolean = true;
        let loadingManageMotives: boolean = true;
    
        this.setState({ loading: loadingStats || loadingBrowseMotives || loadingManageMotives, browseMotives: [], manageMotives: [], stats:null});

        Api.get('/motive/' + view).then((res) => {
            loadingBrowseMotives = false;
            this.setState({loading: loadingStats || loadingBrowseMotives || loadingManageMotives,browseMotives: res.data});
        });

        // get the stats also
        Api.get('/motive/stats').then((statsRes) => {
            loadingStats = false;
            this.setState({loading: loadingStats || loadingBrowseMotives || loadingManageMotives,stats: statsRes.data });
        });

        Api.get('/motive/managing').then((res) => {
            loadingManageMotives = false;
            this.setState({loading: loadingStats || loadingBrowseMotives || loadingManageMotives,manageMotives: res.data });
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
            {motiveManage}
            {motivesBrowse}
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
