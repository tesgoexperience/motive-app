import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Image, Text } from 'react-native';

type PropType = {
    username?: String,
    imageUrl: string
};

export class Profile extends Component<PropType, {}>{
    render() {
        let image = <Image source={{ uri: this.props.imageUrl }} style={{ width: 50, height: 50, borderRadius: 100 / 2 }} />
        if (this.props.username==null) {
            return image;
        }
        return <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>{image}<Text style={{marginStart:5, fontSize:20}} >{this.props.username}</Text></View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    }
});