import axios, { AxiosError, AxiosResponse } from "axios";
import { setItemAsync, deleteItemAsync, getItemAsync } from 'expo-secure-store';
import { AuthError } from "./Errors";

export type User = {
    email: string,
    password: string,
    username?: string,
    accessToken: string,
}


export enum ResponseType {
    INVALID_CREDENTIALS,
    UNKNOWN_ERROR,
    INVALID_ACCESS_TOKEN,
    SERVER_ERROR,
    OK,
    NO_CREDENTIALS
}


export default class AuthUtils {

    public static readonly USER_STORAGE_KEY = "user";
    public static readonly AUTH_STORE_ERROR_MSG = "No user authentication is stored"
    public static readonly AUTH_STORE_MISSING_FIELDS_ERROR_MSG = "Stored user is missing fields"

    // TODO getting the user from the drive every time might cause performance issues, consider a private class variable 
    public static async getStoredUser(): Promise<User> {

        let strUser = await getItemAsync(AuthUtils.USER_STORAGE_KEY);

        if (strUser == null) {
            throw new AuthError(AuthUtils.AUTH_STORE_ERROR_MSG);
        }

        let user: User = JSON.parse(strUser);

        // check the user object has an access token
        if (user.accessToken == undefined) {
            throw new AuthError(AuthUtils.AUTH_STORE_MISSING_FIELDS_ERROR_MSG);
        }

        return user;
    }

    public static setStoredUser(user: User) {
        setItemAsync(AuthUtils.USER_STORAGE_KEY, JSON.stringify(user));
    }

    private static async checkTokenValidity(token: string): Promise<boolean> {
        if (token == undefined || token == null || token == "") {
            return false;
        }

        // check if the access token is valid
        try {

            let res = await axios.get('http://192.168.0.41:8080/user/', { headers: { "Authorization": token } });

            return true;

        } catch (err) {

            //If token is invalid, try to get another using stored user details
            //TODO clear the stored user and redirect the user to the login page 
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
    public static async attemptAuthentication(user?: User): Promise<ResponseType> {

        // if a user wasn't passed in, get user details from storage
        if (user == undefined) {
            try {
                user = await this.getStoredUser();
            } catch (error) { // there is no user stored or passed in, so there is nothing to authenticate
                return ResponseType.NO_CREDENTIALS;
            }
        }

        if (!this.checkTokenValidity(user.accessToken)) {
            try {

                let res = await axios.post('http://192.168.0.41:8080/user/login', { email: user.email, password: user.password })

                //update the access tokens with the new info
                user.accessToken = res.data;
                AuthUtils.setStoredUser(user);

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
                    return ResponseType.UNKNOWN_ERROR;
                }
            }
        }
        else {
            return ResponseType.OK;
        }
    }
}
