import { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Profile } from '../util/Profile';
import { colors } from '../util/Styles';
import { BackButton } from '../util/BackButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../util/RootStackParams';
import ChatBrowseHelper, { ChatPreview } from '../util/helpers/ChatBrowseHelper';


type StateType = {
    chats: Array<ChatPreview>
}
export class BrowseChat extends Component<{ navigation: NativeStackNavigationProp<RootStackParams, "Friends"> }, StateType> {

    state: StateType = { chats: [] }
    helper: ChatBrowseHelper;
    constructor(props: any) {
        super(props)
        this.helper = new ChatBrowseHelper(this);
    }

    componentDidMount(): void {
        this.helper.initialLoad();
        this.helper.startListener();
    }

    componentWillUnmount(): void {
        this.helper.stopListener();
    }

    renderChatCard(chat: ChatPreview) {
        return <View style={{ marginBottom: 20, justifyContent: 'center', padding: 10, borderWidth: 2, borderColor: chat.unread ? colors.green : colors.lightgray, borderRadius: 10, height: 95, width: "95%" }}>
            <View style={{ flexDirection: "row" }}>
                <Profile subtextSize={15} size={1} subtext={chat.headMessageId == '' ? "           " :  chat.headMessage} username={chat.title} />
            </View>
        </View>
    }
    public render() {
        let chats =  this.state.chats.map(chat => { return this.renderChatCard(chat) });

        return <View style={{ paddingTop: 10 }}>
            <View style={{ paddingLeft: 15 }}>
                {<BackButton navigation={this.props.navigation} />}
            </View>
            <ScrollView contentContainerStyle={{ height:'100%', alignItems: 'center', paddingTop: 20 }}>
               {chats}
            </ScrollView>
        </View>
    }
}