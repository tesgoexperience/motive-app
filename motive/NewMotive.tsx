import { Component } from "react";
import { CommonStyle } from "../util/Styles";
import { TextInput, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native";

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParams } from "../navigation/RootStackParams";
import { BackButton } from "../util/BackButton";
import DateTimePicker from '@react-native-community/datetimepicker';
// import DatePicker from 'react-native-modern-datepicker';

type CreateMotive = {
    title: string,
    description: string,
    start: Date,
    hiddenFrom: Array<String>
}

type PropType = {
    navigation: NativeStackNavigationProp<RootStackParams, "NewMotive">;
};

type StateType = {
    motive: CreateMotive,
    showDatePicker: boolean,
    pickTime: boolean
}

class NewMotive extends Component<PropType, StateType> {

    state: StateType = { pickTime: false, showDatePicker: false, motive: { title: "", description: "", start: new Date(), hiddenFrom: [] } };

    submitMotive() {

    }

    public render() {
        let datePicker;

        if (this.state.showDatePicker) {
            let displayMode:any = (this.state.pickTime ? 'time' : 'date');
            
            datePicker = <DateTimePicker mode={displayMode} textColor="#000000" display="spinner" style={{ width: 300, height: 300 }} value={this.state.motive.start} onChange={(event: any, date?: Date) => date ? this.setState({ motive: { ...this.state.motive, start: date } }) : null} />
            
        }

        return (
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss();  this.setState({ showDatePicker: false })} }>
                <View style={CommonStyle.formView}>
                    <BackButton navigation={this.props.navigation} />
                    <View>
                        <View style={CommonStyle.inputContainer}>
                            <Text style={CommonStyle.label}> Title: </Text>
                            <TextInput
                                style={CommonStyle.input}
                                onChange={(e) => { this.setState({ motive: { ...this.state.motive, title: e.nativeEvent.text } }) }}
                                placeholder='Title'
                            />
                        </View>
                        <View style={CommonStyle.inputContainer}>
                            <Text style={CommonStyle.label}> Description: </Text>
                            <TextInput
                                multiline={true}
                                style={[CommonStyle.input, { height: 150 }]}
                                onChange={(e) => { this.setState({ motive: { ...this.state.motive, description: e.nativeEvent.text } }) }}
                            />
                        </View>

                        <View style={CommonStyle.inputContainer}>
                            <Text style={CommonStyle.label}> Start: </Text>
                            <View style={{ flex: 0, flexDirection: 'row' }}>
                                <TouchableOpacity style={{ width: "70%", marginRight: "5%" }} onPress={() => this.setState({ showDatePicker: true, pickTime: false })}>
                                    <Text style={CommonStyle.input}> {this.state.motive.start.getDate() + "/" + (this.state.motive.start.getMonth() + 1) + "/" + this.state.motive.start.getFullYear()} </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: "25%" }} onPress={() => this.setState({ showDatePicker: true, pickTime: true })}>
                                    <Text style={CommonStyle.input}> {this.state.motive.start.getHours() + ":" + this.state.motive.start.getMinutes()} </Text>
                                </TouchableOpacity>
                            </View>
                            {datePicker}

                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'gray', width: '100%', marginTop: 20 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}  style={[CommonStyle.redBackground, CommonStyle.redBorder, { padding: 10, width: "45%", height: 40 }]}>
                                <Text style={{ textAlign: 'center' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  style={[CommonStyle.greenBackground, CommonStyle.greenBorder, { padding: 10, width: "45%", height: 40 }]}>
                                <Text style={{ textAlign: 'center' }}>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>

        );
    }
}

export default NewMotive;