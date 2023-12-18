import { Component } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { CommonStyle } from '../util/Styles';

export class Chat extends Component<{}, { input: string, inputting: boolean }>{
    state: any = { input: "", inputting: false }
    public render() {
        return (
            <View style={{ padding: 5, width: '100%', height: "100%", backgroundColor: 'red' }}>
                <View style={{ width: '100%', paddingTop: 45, height: this.state.inputting ? "57%" : "90%", backgroundColor: 'green' }}>
                    <ScrollView style={{ backgroundColor: 'gray', transform: [{ scaleY: -1 }] }} showsVerticalScrollIndicator={false} >
                        <View>
                            <Text style={{ transform: [{ scaleY: -1 }], backgroundColor: 'orange', width: "70%", margin: 10, padding: 10 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eget purus ac nisi po lacinia nec urna blandit, commodo sagittis odio. Aliquam erat volutpat. In pulvinar sagittis nibh, ac fringilla justo. Donec mauris odio, accumsan eleifend scelerisque at, porta sit amet sapien.</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Text style={{ transform: [{ scaleY: -1 }], backgroundColor: 'orange', width: "70%", margin: 10, padding: 10 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eget purus ac nisi po lacinia nec urna blandit, commodo sagittis odio. Aliquam erat volutpat. In pulvinar sagittis nibh, ac fringilla justo. Donec mauris odio, accumsan eleifend scelerisque at, porta sit amet sapien.</Text>
                        </View>
                        <View>
                            <Text style={{ transform: [{ scaleY: -1 }], backgroundColor: 'orange', width: "70%", margin: 10, padding: 10 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eget purus ac nisi po lacinia nec urna blandit, commodo sagittis odio. Aliquam erat volutpat. In pulvinar sagittis nibh, ac fringilla justo. Donec mauris odio, accumsan eleifend scelerisque at, porta sit amet sapien.</Text>
                        </View>
                        <View>
                            <Text style={{ transform: [{ scaleY: -1 }], backgroundColor: 'orange', width: "70%", margin: 10, padding: 10 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eget purus ac nisi po lacinia nec urna blandit, commodo sagittis odio. Aliquam erat volutpat. In pulvinar sagittis nibh, ac fringilla justo. Donec mauris odio, accumsan eleifend scelerisque at, porta sit amet sapien.</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Text style={{ transform: [{ scaleY: -1 }], backgroundColor: 'orange', width: "70%", margin: 10, padding: 10 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eget purus ac nisi po lacinia nec urna blandit, commodo sagittis odio. Aliquam erat volutpat. In pulvinar sagittis nibh, ac fringilla justo. Donec mauris odio, accumsan eleifend scelerisque at, porta sit amet sapien.</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Text style={{ transform: [{ scaleY: -1 }], backgroundColor: 'orange', width: "70%", margin: 10, padding: 10 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eget purus ac nisi po lacinia nec urna blandit, commodo sagittis odio. Aliquam erat volutpat. In pulvinar sagittis nibh, ac fringilla justo. Donec mauris odio, accumsan eleifend scelerisque at, porta sit amet sapien.</Text>
                        </View>
                    </ScrollView>
                </View>
                <View style={{ width: '100%', height: "90%", backgroundColor: 'blue' }}>
                    <TextInput
                        style={[CommonStyle.input]}
                        value={this.state.input}
                        onFocus={() => this.setState({ inputting: true })}
                        onBlur={() => this.setState({ inputting: false })}
                        onChange={(e) => { this.setState({ input: e.nativeEvent.text }) }}
                        placeholder='Title'
                    />
                </View>
            </View>
        )
    }
}
