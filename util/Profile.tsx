import { Component } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';

type PropType = {
    username?: String,
    imageUrl?: string,
    subtext?: string,
    subtextSize?: number,
    size?: 0.5 | 0.75 | 1,
    direction?: 'column' | 'row',
    subtextColor?: string
};

export class Profile extends Component<PropType, {}>{

    // get the image using username if it is not supplied
    render() {

        let multiplier = this.props.size ? this.props.size : 1;
        let url = this.props.imageUrl ? this.props.imageUrl : "https://source.unsplash.com/random/?portrait";
        let image = <Image source={{ uri: url }} style={{ width: 50 * multiplier, height: 50 * multiplier, borderRadius: 100 / 2 }} />
        let direction = this.props.direction ? this.props.direction : 'row'

        if (this.props.username == null) {
            return image;
        }

        return <View style={{ flex: 1, flexDirection: direction, justifyContent: 'flex-start', alignItems: 'center' }}>{image}
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text style={{marginStart: 5, fontSize: 20 * multiplier }} >
                    {this.props.username}
                </Text>
                {this.props.subtext ? <Text style={{ marginStart: 5, fontSize: this.props.subtextSize ? this.props.subtextSize : 10 }} > {this.props.subtext} </Text> : <></>}
            </View>
        </View>
    }
}