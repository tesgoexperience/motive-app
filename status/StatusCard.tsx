import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Profile } from '../util/Profile';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import UserList from '../util/UserList';
import Api from '../util/Api';
import { colors } from '../util/Styles';
import DateUtil from '../util/DateUtil';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type Status = {
    id: number,
    title: string,
    owner: string,
    belongsToMe: boolean,
    timePosted: Date,
    interested: boolean
}

export class StatusCard extends Component<{ status: Status, navigator: any }, { status: Status, loading: boolean, viewInterested: boolean }>{
    state = { status: this.props.status, loading: false, viewInterested: false, interestedUsers: ['gregg', 'john'] }

    toggleInterest() {
        let option: string = this.state.status.interested ? 'remove' : 'add';
        Api.post('/status/interest/' + option, this.state.status.id).then(r => {
            this.setState({ status: { ...this.state.status, interested: !this.state.status.interested } })
        })
    }

    componentDidMount(): void {
        this.setState({
            loading: false
        });
    }

    getOptions() {
        // if owner, return list of interested people
        if (this.state.status.belongsToMe) {
            return <View style={{ padding: 5 }}><TouchableOpacity onPress={() => { this.setState({ viewInterested: true }) }} style={{ width: '100%', borderRadius: 5, padding: 4, borderColor: '#69FFAA', borderWidth: 1 }}><Text style={{ textAlign: 'center', fontWeight: '600' }}>View Interest<Text style={{ color: 'red', fontWeight: 'bold' }}> • {this.state.interestedUsers.length}</Text></Text></TouchableOpacity>
            </View>
        }

        // else if interest registered, return not interested anymore button
        if (this.state.status.interested) {
            return <View style={{ flex: 1, padding: 5 }}>
                <TouchableOpacity onPress={() => this.toggleInterest()} style={{ width: '100%', borderRadius: 5, padding: 4, backgroundColor: colors.red }}><Text style={{ textAlign: 'center', fontWeight: '600' }}>No longer interested</Text></TouchableOpacity>
            </View>
        }

        // return I'm interested button
        return <View style={{ flex: 1, padding: 5 }}>
            <TouchableOpacity onPress={() => this.toggleInterest()} style={{ width: '100%', borderRadius: 5, padding: 4, backgroundColor: '#69FFAA' }}><Text style={{ textAlign: 'center', fontWeight: '600' }}>I'm Interested</Text></TouchableOpacity>
        </View>
    }

    render() {
        if (this.state.loading) {
            return;
        }

        if (this.state.viewInterested) {
            this.props.navigator.navigate('ListUsers', { users: this.state.interestedUsers, title: 'Theses users expressed interested' });
        }

        return <View style={{ flexDirection: 'column', borderColor: this.state.status.interested ? colors.green : colors.lightgray, borderWidth: 1, borderRadius: 10, width: '95%', marginTop: 30 }}>
            <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between', margin: 10, marginLeft: 15, marginTop: 20 }}>
                {<Profile subtext={DateUtil.diff(this.state.status.timePosted, new Date())} imageUrl={"https://source.unsplash.com/random/?portrait"} username={this.state.status.owner} />}
                <Menu>
                    <MenuTrigger><Entypo name="dots-three-vertical" size={15} color="#919191" /></MenuTrigger>
                    <MenuOptions>
                        <MenuOption onSelect={() => alert(`Test`)} text='Edit viewers list' />
                        <MenuOption onSelect={() => alert(`Delete`)} >
                            <Text style={{ color: 'red' }}>Delete</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </View>
            <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'center', margin: 5, marginBottom: 5, padding: 10 }}>
                <Text style={{ flexShrink: 1, fontSize: 20, fontWeight: '400' }}>{this.state.status.title}</Text>
            </View>
            {this.getOptions()}
        </View>
    }
}
