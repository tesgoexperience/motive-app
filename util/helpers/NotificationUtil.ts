import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from "react-native";
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import Api from './Api';

export default class NotificationUtil {
    public static readonly NOTIFICATION_TOKEN_KEY = "NOTIFICATION_TOKEN";

    public async registerForPushNotificationsAsync() {

        // Check if a push has already been requested
        let tokenExists = await this.tokenAlreadyExists()
        if (tokenExists){
            deleteItemAsync(NotificationUtil.NOTIFICATION_TOKEN_KEY)
            return;
        }
        
        let token: string;
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }

            token = (await Notifications.getExpoPushTokenAsync()).data;
            Api.post("/notification/add-token", token,{headers: {"Content-Type": "text/plain"}}).then(async res => {
                await setItemAsync(NotificationUtil.NOTIFICATION_TOKEN_KEY, token);
            });

        } else {
            alert('Must use physical device for Push Notifications');
        }
    }

    private async tokenAlreadyExists(): Promise<boolean> {
        let token = await getItemAsync(NotificationUtil.NOTIFICATION_TOKEN_KEY);
        return token != null;
    }
}
