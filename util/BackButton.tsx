import { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';


export class BackButton extends Component<{ navigation: any }, {}>{
    render() {
        let button = <View style={{ margin: 20, marginLeft:0 }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}><Text style={{ fontWeight: 'bold', fontSize: 20 }}>Back</Text></TouchableOpacity>
        </View>
        return button;
    }
}

