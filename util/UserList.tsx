import { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Profile } from "./Profile";
import { CommonStyle } from "./Styles";

export type option = {
    title: string,
    color: 'GOOD' | 'BAD',
    onclick: any
}

export type User = {
    username: string,
    options: Array<option>
}

class UserSelect extends Component<{ title: string, users: Array<User>}, {}> {
    render() {
        return <View>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{this.props.title}<Text style={{ color: 'red', fontWeight: 'bold' }}> • {this.props.users.length}</Text></Text>
            {this.props.users.map((user => {
                return <View style={{ flex: 0, flexDirection: "row", justifyContent: 'space-between', marginTop: 20 }}>
                    <View style={{ width: "60%" }}><Profile username={user.username} /></View>
                    <View style={{ flex: 0, flexDirection: 'row', justifyContent: "flex-end", width: '40%', alignItems:'center' }}>
                        {user.options.map((option) => {
                            return <TouchableOpacity onPress={() => option.onclick(user.username)} style={[option.color=='GOOD' ? CommonStyle.greenBorder :  CommonStyle.redBorder   ,{ paddingEnd: 10, paddingStart: 10, justifyContent: 'center', marginRight: 10, height: 40}]}><Text style={{fontWeight:'bold'}}>{option.title}</Text></TouchableOpacity>
                        })}
                    </View>
                </View>
            }))}
        </View>
    }
}

export default UserSelect;
