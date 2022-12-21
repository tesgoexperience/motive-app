import { Component, FieldsetHTMLAttributes } from "react";
import { CommonStyle } from "../util/Styles";
import { TextInput, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, StyleSheet, ScrollView, Alert } from "react-native";

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParams } from "../navigation/RootStackParams";
import { BackButton } from "../util/BackButton";
import DateTimePicker from '@react-native-community/datetimepicker';

type CreateMotive = {
    title: string,
    description: string,
    start: Date,
    specificallyInvited: Array<String>,
    visibility: 'EVERYONE' | 'FRIENDS' | 'SPECIFIC'
}

enum FIELDS {
    TITLE,
    DESCRIPTION,
    START,
    SPECIFIC
}

type PropType = {
    navigation: NativeStackNavigationProp<RootStackParams, "NewMotive">;
};

type StateType = {
    motive: CreateMotive,
    showDatePicker: boolean,
    pickTime: boolean,
    errors: Array<FIELDS>
}

class NewMotive extends Component<PropType, StateType> {

    state: StateType = { errors: [], pickTime: false, showDatePicker: false, motive: { title: "", description: "", start: new Date(), specificallyInvited: [], visibility: 'EVERYONE' } };

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

        if (this.state.motive.visibility == 'SPECIFIC' && this.state.motive.specificallyInvited.length == 0) {
            errors.push(FIELDS.SPECIFIC);
            Alert.alert('If you select specifically invited, You have to select at least one friend. To select friends, Click the pencil next the "Specific Friends" button.');
            valid = false;
        }

        this.setState({ errors: errors });

    }

    // if the field is in the error list, return a red border
    pickBorder(field: FIELDS) {
        if (this.state.errors.includes(field)) {
            return CommonStyle.redBorder;
        }
    }
    pickBackground(visibility: string) {
        if (this.state.motive.visibility == visibility) {
            return [CommonStyle.greenBorder, CommonStyle.greenBackground];
        } else {
            return [CommonStyle.neutralBorder];

        }
    }

    public render() {
        let datePicker;

        if (this.state.showDatePicker) {
            let displayMode: any = (this.state.pickTime ? 'time' : 'date');
            datePicker = <DateTimePicker mode={displayMode} textColor="#000000" display="spinner" style={{ width: 300, height: 300 }} value={this.state.motive.start} onChange={(event: any, date?: Date) => date ? this.setState({ motive: { ...this.state.motive, start: date } }) : null} />
        }

        return (
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); this.setState({ showDatePicker: false }) }}>
                <View style={[CommonStyle.formView, { justifyContent: "flex-start", paddingTop: 0 }]}>
                    <ScrollView>
                        <BackButton navigation={this.props.navigation} />

                        <View style={CommonStyle.inputContainer}>
                            <Text style={CommonStyle.label}> Title: </Text>
                            <TextInput
                                style={[CommonStyle.input, this.pickBorder(FIELDS.TITLE)]}
                                onChange={(e) => { this.setState({ motive: { ...this.state.motive, title: e.nativeEvent.text } }) }}
                                placeholder='Title'
                            />
                        </View>
                        <View style={CommonStyle.inputContainer}>
                            <Text style={CommonStyle.label}> Description: </Text>
                            <TextInput
                                multiline={true}
                                style={[CommonStyle.input, this.pickBorder(FIELDS.DESCRIPTION), { height: 150 }]}
                                onChange={(e) => { this.setState({ motive: { ...this.state.motive, description: e.nativeEvent.text } }) }}
                            />
                        </View>
                        <View style={CommonStyle.inputContainer}>
                            <Text style={CommonStyle.label}> Start: </Text>
                            <View style={{ flex: 0, flexDirection: 'row' }}>
                                <TouchableOpacity style={{ width: "70%", marginRight: "5%" }} onPress={() => this.setState({ showDatePicker: true, pickTime: false })}>
                                    <Text style={[CommonStyle.input, this.pickBorder(FIELDS.START)]}> {this.state.motive.start.getDate() + "/" + (this.state.motive.start.getMonth() + 1) + "/" + this.state.motive.start.getFullYear()} </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: "25%" }} onPress={() => this.setState({ showDatePicker: true, pickTime: true })}>
                                    <Text style={[CommonStyle.input, this.pickBorder(FIELDS.START)]}> {this.state.motive.start.getHours() + ":" + this.state.motive.start.getMinutes()} </Text>
                                </TouchableOpacity>
                            </View>
                            {datePicker}
                        </View>
                        <View style={CommonStyle.inputContainer}>
                            <Text style={CommonStyle.label}> Who can request to attend: </Text>

                            <TouchableOpacity onPress={() => this.setState({ motive: { ...this.state.motive, visibility: 'EVERYONE' } })}>
                                <Text style={[CommonStyle.input, { textAlign: 'center' }, this.pickBackground('EVERYONE')]}>Everyone</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setState({ motive: { ...this.state.motive, visibility: 'FRIENDS' } })}>
                                <Text style={[CommonStyle.input, { textAlign: 'center', marginTop: 10 }, this.pickBackground('FRIENDS')]}>Friends Only</Text>
                            </TouchableOpacity>

                            <View style={{ flex: 0, flexDirection: 'row' }}>
                                <TouchableOpacity style={{ width: "70%", marginRight: "5%" }} onPress={() => this.setState({ motive: { ...this.state.motive, visibility: 'SPECIFIC' } })}>
                                    <Text style={[CommonStyle.input, { textAlign: 'center', marginTop: 10 }, this.pickBackground('SPECIFIC'), this.pickBorder(FIELDS.SPECIFIC)]}>Specific Friends</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ width: "25%" }} onPress={() => this.setState({ motive: { ...this.state.motive, visibility: 'SPECIFIC' } })}>
                                    <Text style={[CommonStyle.input, { textAlign: 'center', marginTop: 10 }, this.pickBackground('SPECIFIC'), this.pickBorder(FIELDS.SPECIFIC)]}>✏️</Text>
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