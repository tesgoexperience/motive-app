import React from "react";
import Api from "./Api";

export type ChatPreview = {
    chatId: string,
    title: string,
    headMessage: string,
    headMessageId: string
    headMessageSender: string,
    unread: boolean
}

export default class ChatBrowseHelper {
    comp: React.Component;
    interval: any;
    chatPreviews: Array<ChatPreview> = [];
    constructor(comp: React.Component) {
        this.comp = comp;
    }
    public startListener(): void {
        this.interval = setInterval(() => {
            Api.post('/chat/update', this.chatPreviews).then((res) => {
               if (res.data) {
                    this.initialLoad();
               }
            });
        }, 2000)
    }
    public stopListener(): void {
        clearInterval(this.interval);
    }

    public initialLoad() {
        // get chats
        Api.get('/chat/preview').then((res) => {
            this.chatPreviews = res.data;
            this.comp.setState({ chats: this.chatPreviews })
        }).catch(err => {
            console.log(err)
        });
    }
    private listen(): void {
    }
}