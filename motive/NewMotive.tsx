import { Component } from "react";
import { CommonStyle } from "../util/Styles";
import { TextInput, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, StyleSheet, ScrollView, Alert } from "react-native";

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParams } from "../util/RootStackParams";
import { BackButton } from "../util/BackButton";
import DateTimePicker from '@react-native-community/datetimepicker';
import Api from "../util/helpers/Api";
import { Loading } from "../util/Loading";
import UserSelect from '../util/UserSelect'
import MotiveHelper from "../util/helpers/MotiveHelper";
type CreateMotive = {
    title: string,
    description: string,
    start: Date,
    end: Date,
    specificallyInvited: Array<String>,
    attendanceType: 'EVERYONE' | 'FRIENDS' | 'SPECIFIC_FRIENDS'
}

enum FIELDS {
    TITLE,
    DESCRIPTION,
    START,
    SPECIFIC_FRIENDS,
    END
}

type PropType = {
    navigation: NativeStackNavigationProp<RootStackParams, "NewMotive">;
};

type StateType = {
    motive: CreateMotive,
    showStartDatePicker: boolean,
    showEndDatePicker: boolean,
    pickTime: boolean,
    errors: Array<FIELDS>,
    loading: boolean,
    selectSpecificUsers: boolean,
    friendList: Array<string>
}

class NewMotive extends Component<PropType, StateType> {

    state: StateType = { friendList: [], selectSpecificUsers: false, errors: [], pickTime: false, showStartDatePicker: false,showEndDatePicker: false, motive: { title: "", description: "", start: new Date(), specificallyInvited: [], attendanceType: 'EVERYONE', end: new Date() }, loading: false };

    submitMotive() {
        let valid: boolean = true;
        let errors: Array<FIELDS> = [];

        if (this.state.motive.title == '') {
            errors.push(FIELDS.TITLE);
            valid = false;
        }

        if (this.state.motive.description == '') {
            errors.push(FIELDS.DESCRIPTION);
            valid = false;
        }

        if (this.state.motive.start < new Date()) {
            errors.push(FIELDS.START);
            Alert.alert('Start Date/Time cannot be in the past.');
            valid = false;
        }
        if (this.state.motive.end < this.state.motive.start) {
            errors.push(FIELDS.END);
            Alert.alert('End Date/Time cannot before start date');
            valid = false;
        }
        if (this.state.motive.attendanceType == 'SPECIFIC_FRIENDS' && this.state.motive.specificallyInvited.length == 0) {
            errors.push(FIELDS.SPECIFIC_FRIENDS);
            Alert.alert('If you select specifically invited, You have to select at least one friend. To select friends, Click the pencil next the "Specific Friends" button.');
            valid = false;
        }

        if (!valid) {
            this.setState({ errors: errors });
        }
        else {
            this.setState({ loading: true });
            Api.post('/motive/create', this.state.motive).then(res => {
                this.setState({ loading: false });
                this.props.navigation.goBack();
            }).catch(err => {
                this.setState({ loading: false });
                Alert.alert('Unknown error occurred');
            })
        }

    }


    componentDidMount(): void {
        this.setState({ loading: true });
        Api.get('/friendship/').then(res => {
            this.setState({ friendList: res.data['friends'], loading: false })
        });
    }

    // if the field is in the error list, return a red border
    pickBorder(field: FIELDS) {
        if (this.state.errors.includes(field)) {
            return CommonStyle.redBorder;
        }
    }

    pickBackground(visibility: string) {
        if (this.state.motive.attendanceType == visibility) {
            return [CommonStyle.greenBorder, CommonStyle.greenBackground];
        } else {
            return [CommonStyle.neutralBorder];

        }
    }

    selectionComplete = (selection: Map<string, boolean>) => {
        this.setState({ selectSpecificUsers: false })
        let selectionFriends: Array<string> = [];
        selection.forEach((v, k) => {
            if (v) {
                selectionFriends.push(k);
            }
        })

        this.setState({ motive: { ...this.state.motive, specificallyInvited: selectionFriends } });

    }

    getFriendList(): Map<string, boolean> {
        let selectedList: Map<string, boolean> = new Map<string, boolean>();

        this.state.friendList.map(f => {
            selectedList.set(f, this.state.motive.specificallyInvited.includes(f));
        })

        return selectedList;
    }

    getDateSelector(start: boolean) {
        let displayMode: any = (this.state.pickTime ? 'time' : 'date');
        let updateDate = (date: Date) => {
            start ? this.setState({ motive: { ...this.state.motive, start: date } }) :  this.setState({ motive: { ...this.state.motive, end: date } });
        }

        return <DateTimePicker mode={displayMode} textColor="#000000" display="spinner" style={{ width: 300, height: 300 }} value={ start ? this.state.motive.start : this.state.motive.end} onChange={(event: any, date?: Date) => date ? updateDate(date) : null} />

    }
    public render() {
        if (this.state.loading) {
            return <Loading />
        }

        if (this.state.selectSpecificUsers) {
            return <UserSelect title="Which friends do you want to invite?" cancel={() => {
                this.setState({ selectSpecificUsers: false });
            }} done={this.selectionComplete} userList={this.getFriendList()} />
        }

        let startDatePicker;
        if (this.state.showStartDatePicker) {
            startDatePicker = this.getDateSelector(true);
        }
        let endDatePicker;
        if (this.state.showEndDatePicker) {
            endDatePicker = this.getDateSelector(false);
        }

        return (
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); this.setState({ showStartDatePicker: false, showEndDatePicker: false}) }}>
                <View style={[CommonStyle.formView, { justifyContent: "flex-start", paddingTop: 0 }]}>
                    <ScrollView>
                        <BackButton navigation={this.props.navigation} />

                        <View style={CommonStyle.inputContainer}>
                            <Text style={CommonStyle.label}> Title: </Text>
                            <TextInput
                                style={[CommonStyle.input, this.pickBorder(FIELDS.TITLE)]}
                                value={this.state.motive.title}
                                onChange={(e) => { this.setState({ motive: { ...this.state.motive, title: e.nativeEvent.text } }) }}
                                placeholder='Title'
                            />
                        </View>
                        <View style={CommonStyle.inputContainer}>
                            <Text style={CommonStyle.label}> Description: </Text>
                            <TextInput
                                multiline={true}
                                value={this.state.motive.description}
                                style={[CommonStyle.input, this.pickBorder(FIELDS.DESCRIPTION), { height: 150 }]}
                                onChange={(e) => { this.setState({ motive: { ...this.state.motive, description: e.nativeEvent.text } }) }}
                            />
                        </View>
                        <View style={CommonStyle.inputContainer}>
                            <Text style={CommonStyle.label}> Start: </Text>
                            <View style={{ flex: 0, flexDirection: 'row' }}>
                                {/* If you are switching from pick time to pick date, don't hide the the date picker */}
                                <TouchableOpacity style={{ width: "70%", marginRight: "5%" }} onPress={() => this.setState({showEndDatePicker : false, showStartDatePicker: this.state.pickTime ? true : !this.state.showStartDatePicker, pickTime: false })}>
                                    <Text style={[CommonStyle.input, this.pickBorder(FIELDS.START)]}> {MotiveHelper.formatDate(this.state.motive.start)} </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: "25%" }} onPress={() => this.setState({showEndDatePicker : false, showStartDatePicker: this.state.pickTime ? !this.state.showStartDatePicker : true, pickTime: true })}>
                                    <Text style={[CommonStyle.input, this.pickBorder(FIELDS.START)]}> {MotiveHelper.formatTime(this.state.motive.start)} </Text>
                                </TouchableOpacity>
                            </View>
                            {startDatePicker}
                        </View>
                        <View style={CommonStyle.inputContainer}>
                            <Text style={CommonStyle.label}> End: </Text>
                            <View style={{ flex: 0, flexDirection: 'row' }}>
                                {/* If you are switching from pick time to pick date, don't hide the the date picker */}
                                <TouchableOpacity style={{ width: "70%", marginRight: "5%" }} onPress={() => this.setState({showStartDatePicker:false, showEndDatePicker: this.state.pickTime ? true : !this.state.showEndDatePicker, pickTime: false })}>
                                    <Text style={[CommonStyle.input, this.pickBorder(FIELDS.END)]}> {MotiveHelper.formatDate(this.state.motive.end)} </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: "25%" }} onPress={() => this.setState({showStartDatePicker:false, showEndDatePicker: this.state.pickTime ? !this.state.showEndDatePicker : true, pickTime: true })}>
                                    <Text style={[CommonStyle.input, this.pickBorder(FIELDS.END)]}> {MotiveHelper.formatTime(this.state.motive.end)} </Text>
                                </TouchableOpacity>
                            </View>
                            {endDatePicker}
                        </View>
                        <View style={CommonStyle.inputContainer}>
                            <Text style={CommonStyle.label}> Who can request to attend: </Text>

                            <TouchableOpacity onPress={() => this.setState({ motive: { ...this.state.motive, attendanceType: 'EVERYONE' } })}>
                                <Text style={[CommonStyle.input, { textAlign: 'center' }, this.pickBackground('EVERYONE')]}>Everyone</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setState({ motive: { ...this.state.motive, attendanceType: 'FRIENDS' } })}>
                                <Text style={[CommonStyle.input, { textAlign: 'center', marginTop: 10 }, this.pickBackground('FRIENDS')]}>Friends Only</Text>
                            </TouchableOpacity>

                            <View style={{ flex: 0, flexDirection: 'row' }}>
                                <TouchableOpacity style={{ width: "70%", marginRight: "5%" }} onPress={() => this.setState({ motive: { ...this.state.motive, attendanceType: 'SPECIFIC_FRIENDS' } })}>
                                    <Text style={[CommonStyle.input, { textAlign: 'center', marginTop: 10 }, this.pickBackground('SPECIFIC_FRIENDS'), this.pickBorder(FIELDS.SPECIFIC_FRIENDS)]}>Specific Friends</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ width: "25%" }} onPress={() => this.setState({ motive: { ...this.state.motive, attendanceType: 'SPECIFIC_FRIENDS' }, selectSpecificUsers: true })}>
                                    <Text style={[CommonStyle.input, { textAlign: 'center', marginTop: 10 }, this.pickBackground('SPECIFIC_FRIENDS'), this.pickBorder(FIELDS.SPECIFIC_FRIENDS)]}>✏️</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={[CommonStyle.redBackground, CommonStyle.redBorder, { padding: 10, width: "45%", height: 40 }]}>
                                <Text style={{ textAlign: 'center' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.submitMotive() }} style={[CommonStyle.greenBackground, CommonStyle.greenBorder, { padding: 10, width: "45%", height: 40 }]}>
                                <Text style={{ textAlign: 'center' }}>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default NewMotive;