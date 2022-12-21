import { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

export class Loading extends Component<{}, {}>{

    public render() {
       return (<View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color="#00ff00" />
        </View>)
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