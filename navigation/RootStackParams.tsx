import { Motive } from "../motive/EventCard";

export type RootStackParams = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    Friends: undefined;
    AddFriend: undefined;
    NewMotive: undefined;
    ViewMotive: { motive: Motive, owner: boolean }
};