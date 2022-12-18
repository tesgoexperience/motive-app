import React, { Component } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';

type PropType = {
    username?: String,
    imageUrl?: string
};

export class Profile extends Component<PropType, {}>{

    // get the image using username if it is not supplied
    render() {
        let url = this.props.imageUrl  ? this.props.imageUrl : "https://source.unsplash.com/random/?portrait";
        let image = <Image source={{ uri: url }} style={{ width: 50, height: 50, borderRadius: 100 / 2 }} />
        if (this.props.username==null) {
            return image;
        }
        return <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>{image}<Text style={{marginStart:5, fontSize:20}} >{this.props.username}</Text></View>
    }
}