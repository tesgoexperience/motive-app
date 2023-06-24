import React from "react";
import Api from "./Api";

export type Attendance = {
    status: string,
    user: string,
    anonymous: boolean,
    id: string,
}

export type ManagementDetails = {
    requests: Array<string>,
    SpecificallyInvited: Array<string>,
    anonymousAttendees: Array<string>
}

export type Motive = {
    id: string,
    owner: boolean
    ownerUsername: string,
    title: string,
    description: string,
    start: number,
    createdOn: number,
    attendance: Array<string>
    managementDetails: ManagementDetails
}

export default class MotiveHelper {
    public motive: Motive;
    comp: React.Component;
    constructor(motive: Motive, component: React.Component) {
        this.motive = motive;
        this.comp = component;
    }

    public request(anonymous: boolean) {
        this.comp.setState({ loading: true });
        Api.post('/attendance/request', { motive: this.motive.id, anonymous: anonymous }).then((res) => {
            this.loadMyAttendance();
        });
    }

    public refreshMotive() {
        this.comp.setState({ loading: true });
        Api.get('/motive/get?motive=' + this.motive.id).then((res) => {
            this.motive = res.data;
            this.comp.setState({ loading: false });
        });
    }

    public loadMyAttendance() {
        this.comp.setState({ loading: true });

        Api.get('/attendance/?motiveId=' + this.motive.id).then((res) => {
            if (res.data == '' || res.data == null) {
                this.comp.setState({ loading: false, hasAttendance: false });
            } else {
                this.comp.setState({ loading: false, attendance: res.data, hasAttendance: true });
            }
        })
    }


    public removeAttendee(user: string) {
        this.comp.setState({ loading: true });
        Api.post('/attendance/remove', { attendeeUsername: user, motiveId: this.motive.id }).then(() => {
            this.refreshMotive();
        });
    }

    public cancel() {
        this.comp.setState({ loading: true });
        Api.post('/attendance/cancel', this.motive.id).then(() => {
            this.loadMyAttendance();
        });
    }

    public respondToRequest(accept: boolean, attendee: string) {
        this.comp.setState({ loading: true });
        let decision: String = accept ? "accept" : "reject";
        Api.post('/attendance/' + decision, { attendeeUsername: attendee, motiveId: this.motive.id }).then(() => {
            this.refreshMotive();
        });
    }

    private static addZero(val: number) {
        return val < 10 ? "0" + val : "" + val
    }

    public static formatTime(time: number | Date): string {
        let date = new Date(time);
        return MotiveHelper.addZero(date.getHours()) + ":" + MotiveHelper.addZero(date.getMinutes());
    }

    public static formatDate(date: number | Date): string {
        let d = new Date(date);
        return MotiveHelper.addZero(d.getDate()) + "/" + MotiveHelper.addZero(d.getMonth() + 1) + "/" + MotiveHelper.addZero(d.getFullYear());
    }
    public static formatTimeAndDate(date: number | Date): string {
        return MotiveHelper.formatDate(date) + "  " + MotiveHelper.formatTime(date);
    }

}