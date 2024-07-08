import { Component } from 'react';
import { View, Text, TextInput, ScrollView, Touchable, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { CommonStyle, colors } from '../util/Styles';
import { BackButton } from '../util/BackButton';
import React from 'react';
import ChatHelper, { Message } from '../util/helpers/ChatHelper';
import DateUtil from '../util/helpers/DateUtil';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../util/RootStackParams';

type StateType = { messages: Array<Message>, input: string, inputting: boolean }

export class Chat extends Component<{ navigation: NativeStackNavigationProp<RootStackParams, "Chat">, route: any }, StateType> {
    state: StateType = { input: "", inputting: false, messages: [] }
    scrollView: React.RefObject<ScrollView> = React.createRef<ScrollView>();
    helper: ChatHelper;
    previouslyRenderedMessage: Message | null = null;
    constructor(props: any) {
        super(props);
        this.helper = new ChatHelper(this, this.props.route.params.chatId);
        // when the user goes off this screen, turn off the listener
        this.props.navigation.addListener('blur', () => {
            this.helper.stopListener();
        })

        // when the user goes on this screen, turn on the listener
        this.props.navigation.addListener('focus', () => {
            this.helper.loadMessages();
            this.helper.startListener();
        })
    }

    componentDidMount(): void {
        this.helper.loadMessages();
    }
    
    componentWillUnmount(): void {
        this.helper.stopListener();
    }

    private renderMessage(message: Message) {

        let name;
        if (this.previouslyRenderedMessage == null || message.sender != this.previouslyRenderedMessage?.sender) {
            name = <View style={{ flexDirection: 'row', width: "69%", marginBottom: 5, marginTop: 10 }}><Text style={{ fontWeight: 'bold', fontSize: 15 }}> {message.sentByMe ? "You" : message.sender} </Text></View>;
        }

        this.previouslyRenderedMessage = message;

        return message.sentByMe ? <View style={{ flexDirection: 'row', marginTop: 5, width: "100%", justifyContent: 'flex-end' }}>
            <View style={{ flexDirection: 'column', width: '70%' }}>
                {name}
                <View style={{ borderColor: colors.green, padding: 10, borderWidth: 1, borderRadius: 15, backgroundColor: colors.green }}>
                    <Text>{message.content}<Text style={{ color: "#949494" }}> | {DateUtil.diff(message.sentOn, Date.now())} </Text></Text>
                </View>
            </View>
        </View>
            :
            <View style={{ flexDirection: 'column', marginTop: 5 }}>
                {name}
                <View style={{ borderColor: colors.lightgray, padding: 10, borderWidth: 1, borderRadius: 15, backgroundColor: colors.lightgray, width: "70%" }}>
                    <Text>{message.content}<Text style={{ color: "#949494" }}> | {DateUtil.diff(message.sentOn, Date.now())} </Text></Text>
                </View>
            </View>
    }
    
    public render() {

        this.previouslyRenderedMessage = null;
        let messageList = this.state.messages.map(message => { return this.renderMessage(message) });

        return (
            <View style={{padding: 5, width: '100%', height: "100%" }}>
                
                <View style={{ width: '100%', paddingTop: 10, height: this.state.inputting ? "55%" : "90%" }}>
                    <View style={{ paddingLeft: 15, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.lightgray }}>
                        {<BackButton navigation={this.props.navigation} />}
                        <View style={{ width: '70%', justifyContent: 'center' }}><Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>{this.props.route.params.title}</Text></View>
                    </View>
                    <ScrollView onContentSizeChange={() => { this.scrollView.current?.scrollToEnd({ animated: false }) }} ref={this.scrollView} showsVerticalScrollIndicator={false} >
                        {messageList}
                    </ScrollView>
                </View>

                <View style={{ width: '100%', height: '20%', flexDirection: 'row', padding: 10 }}>
                    <TextInput
                        style={[CommonStyle.input, { width: '80%', height: 50, marginRight: 5 }]}
                        value={this.state.input}
                        onFocus={() => this.setState({ inputting: true })}
                        onBlur={() => this.setState({ inputting: false })}
                        onChange={(e) => { this.setState({ input: e.nativeEvent.text }) }}
                        placeholder='Title'
                    />
                    <TouchableOpacity onPress={()=>{
                        this.helper.sendMessage(this.state.input);
                        this.setState({input: ''})}} style={[CommonStyle.greenBorder, CommonStyle.greenBackground, { height: 50, width: '20%', justifyContent: 'center' }]}><Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Send</Text></TouchableOpacity>
                </View>
            </View>
        )
    }
}
