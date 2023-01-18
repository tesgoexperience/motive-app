import { Component } from 'react';
import { TouchableOpacity, View, Text, TextInput } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import Api from '../util/Api';

export class CreateStatus extends Component<{}, { status: string }>{

    state = { status: "" }

    componentDidMount() {
        let placeholders: string[] = [
            'Going to the gym in 30 mins 🏋🏾‍♂️',
            'Eating out at the new food spot. 🍔',
            'Going to Uni library to study for tomorrows biomed exam. I will probably study until mi 📘'
        ]

        this.setState({ status: placeholders[Math.floor(Math.random() * placeholders.length)] });
    }

    shareStatus() {
        Api.post('/status/create', this.state.status ).then(()=>{
            alert("You status has been shared 🎉. Pull down to refresh");
        });
    }
    
    render() {
        return <View style={{ flexDirection: 'column', justifyContent: 'space-between', borderColor: 'lightgray', borderWidth: 1, borderRadius: 10, width: '95%', marginTop: 30 }}>
            <View style={{flex:1, width:"100%", justifyContent:'flex-end', alignItems:'flex-end', paddingTop:10, paddingRight:10}}>
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

            <TextInput
                multiline={true}
                style={{flex:5, padding: 20, paddingTop: 25,  fontSize: 20, fontWeight: '400' }}
                value={this.state.status}
                onChange={(e) => { this.setState({ status: e.nativeEvent.text }) }}
            />
            <View style={{ flex: 2, padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => {this.shareStatus()}} style={{ width: '100%', borderRadius: 5, padding: 4, backgroundColor: '#69FFAA' }}><Text style={{ textAlign: 'center', fontWeight: '600' }}>Share</Text></TouchableOpacity>
            </View>
        </View>
    }
   
}