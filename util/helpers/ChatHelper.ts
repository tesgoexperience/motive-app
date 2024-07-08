import { Alert } from "react-native"
import Api from "./Api"

export type Message = {
    id: string,
    content: string
    sender: string
    sentByMe: boolean
    sentOn: Date
}
export default class ChatHelper { 

    messages: Message[];
    headMessageId: string;
    chatId : string;
    comp : React.Component;
    interval: any;

    constructor(comp: React.Component,chatId : string) {
        this.chatId = chatId;
        this.messages = [];
        this.comp = comp;
        this.headMessageId = '';
    }
    public startListener(): void {
        this.interval = setInterval(() => {
            Api.post('/chat/message/update', {chat : this.chatId, headMessage : this.headMessageId}).then((res) => {
               if (res.data) {
                    this.loadMessages();
               }
               console.log("Checking for up message updates")
            }).catch(err => {
                console.log(err);
            });
        }, 2000)
    }
    public stopListener(): void {
        clearInterval(this.interval);
    }
    public loadMessages(){
        Api.get('/chat/messages?'+"chatId="+this.chatId+"&page=0").then((res) =>{
            this.messages = res.data;
            this.headMessageId = this.messages[this.messages.length-1].id;
            this.comp.setState({messages: this.messages});
        }).catch(err => {
            console.log(err)
        });
    }

    public sendMessage(message: String){
        if (message == '' || message == null) {
            Alert.alert("message cannot be empty");
            return;
        }
        Api.post('chat/send', {chatId: this.chatId, message: message}).then((res)=>{
            this.loadMessages();
        })
    }

}