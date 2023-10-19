import axios, { AxiosError, AxiosResponse } from "axios";
import { setItemAsync, deleteItemAsync, getItemAsync } from 'expo-secure-store';
import { AuthError } from "./Errors";
import NotificationUtil from "./NotificationUtil";

// For authentication of user
export type UserAuthDetails = {
    email: string,
    password: string,
    username?: string,
    accessToken: string,
}

// To be used by components to show the context user
export type simpleUserDetails = {
    email: string,
    username: string,
}

export enum ResponseType {
    INVALID_CREDENTIALS,
    UNKNOWN_ERROR,
    INVALID_ACCESS_TOKEN,
    SERVER_ERROR,
    OK,
    NO_CREDENTIALS
}

const API_URL = process.env.REST_API;

export default class AuthUtils {

    public static readonly USER_STORAGE_KEY = "USER";
    public static readonly AUTH_STORE_ERROR_MSG = "No user authentication is stored"
    public static readonly AUTH_STORE_MISSING_FIELDS_ERROR_MSG = "Stored user is missing fields"

    // TODO getting the user from the drive every time might cause performance issues, consider a private class variable
    public static async getStoredUser(): Promise<UserAuthDetails> {

        let strUser = await getItemAsync(AuthUtils.USER_STORAGE_KEY);

        if (strUser == null) {
            throw new AuthError(AuthUtils.AUTH_STORE_ERROR_MSG);
        }

        let user: UserAuthDetails = JSON.parse(strUser);

        // check the user object has an access token
        if (user.accessToken == undefined) {
            throw new AuthError(AuthUtils.AUTH_STORE_MISSING_FIELDS_ERROR_MSG);
        }

        return user;
    }

    public static logout() {
        AuthUtils.cleanAuth();
    }

    private static cleanAuth() {
        deleteItemAsync(AuthUtils.USER_STORAGE_KEY);
    }

    public static setStoredUser(user: UserAuthDetails) {
        setItemAsync(AuthUtils.USER_STORAGE_KEY, JSON.stringify(user));
    }

    private static async checkTokenValidity(token: string): Promise<boolean> {
        if (token == undefined || token == null || token == "") {
            return false;
        }

        // check if the access token is valid
        try {

            let res = await axios.get(API_URL + '/user/', { headers: { "Authorization": token } });
            return true;

        } catch (err) {
            AuthUtils.cleanAuth();
            return false;
        }
    }

    /**
     * Attempts to authenticate a user
     * if a user is passed in, that user will be authenticated and stored
     * if no user is passed in, then the stored user will be authenticated
     * if an access token is invalid, the stored user email and pass will be used to retrieve another
     * if that also fails, then the stored user is cleared, an error is thrown and then user is sent to login/register
     */
    public static async attemptAuthentication(user?: UserAuthDetails): Promise<ResponseType> {

        // if a user wasn't passed in, get user details from storage
        if (user == undefined) {
            try {
                user = await this.getStoredUser();
            } catch (error) { // there is no user stored or passed in, so there is nothing to authenticate
                return ResponseType.NO_CREDENTIALS;
            }
        }

        if (! await this.checkTokenValidity(user.accessToken)) {

            try {

                let res = await axios.post(API_URL + '/login', {}, {
                    auth: {
                        username: user.email,
                        password: user.password
                    }
                });

                //update the access tokens with the new info
                user.accessToken = res.data;
                
                AuthUtils.setStoredUser(user);
                // after a login, attempt to request a notification token
                new NotificationUtil().registerForPushNotificationsAsync();
                return ResponseType.OK;
            }
            catch (error: unknown) {
                if (error instanceof AxiosError) {
                    if (error.response?.status == 406) {
                        return ResponseType.INVALID_CREDENTIALS;
                    } else {
                        return ResponseType.SERVER_ERROR;
                    }
                }
                else {
                    console.log(error)
                    return ResponseType.UNKNOWN_ERROR;
                }
            }
        }
        else {
            return ResponseType.OK;
        }
    }

}


