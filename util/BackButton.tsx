import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function BackButton ( navigation: any) {
    return (<View style={[styles.container, styles.horizontal]}><TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}><Text style={{ fontWeight: 'bold', fontSize: 20 }}>Back</Text></TouchableOpacity></View>)
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