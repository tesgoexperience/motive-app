import axios, { AxiosError, AxiosResponse } from "axios";
import { setItemAsync, deleteItemAsync, getItemAsync } from 'expo-secure-store';
import { Alert } from "react-native";
import { AuthError } from "./util/Errors";

// TODO move to environment variable
const apiURL = "http://192.168.0.41:8080"

const Api = axios.create({
    baseURL: apiURL
})

export type User = {
    email: string,
    password: string,
    username?: string,
    accessToken?: string,
    accessTokenBirth?: number
}

export enum ResponseType {
    INVALID_CREDENTIALS,
    UNKNOWN_ERROR,
    INVALID_ACCESS_TOKEN,
    SERVER_ERROR,
    OK
}

export class AuthUtils {

    public static readonly USER_STORAGE_KEY = "user";
    public static readonly AUTH_STORE_ERROR_MSG = "No user authentication is stored"
    public static readonly AUTH_STORE_MISSING_FIELDS_ERROR_MSG = "Stored user is missing fields"

    public static async getStoredUser(): Promise<User> {

        let strUser = await getItemAsync(AuthUtils.USER_STORAGE_KEY);

        if (strUser == null) {
            throw new AuthError(AuthUtils.AUTH_STORE_ERROR_MSG);
        }

        let user: User = JSON.parse(strUser);

        // check the user object has the 
        if (user.accessToken == undefined || user.accessTokenBirth == undefined) {
            throw new AuthError(AuthUtils.AUTH_STORE_MISSING_FIELDS_ERROR_MSG);
        }

        return user;
    }

    public static setStoredUser(user: User) {
        setItemAsync(AuthUtils.USER_STORAGE_KEY, JSON.stringify(user));
    }

    // Checks if the current token is valid
    // if it is not, we check if user objects are stored
    public static async attemptAuthentication(user?: User): Promise<ResponseType> {

        // if a user wasn't passed in, get user details from storage
        if (user == undefined) {
            user = await this.getStoredUser();
        }

        if (user.accessToken == undefined) {
            try {

                //  await axios.post(apiURL + '/user/login', { email: user.email, password: user.password })
                //  .then(res => {
                //     Alert.alert("test");
                // })
                // .catch(err => {
                //     Alert.alert("testf");
                // })
                let res = await axios.post(apiURL + '/user/login', { email: user.email, password: user.password })
                //update the access tokens with the new info
                user.accessToken = res.data;
                user.accessTokenBirth = new Date().getTime();
                AuthUtils.setStoredUser(user);

                return ResponseType.OK;
            }
            catch (error: unknown) {
                if (error instanceof AxiosError) {
                    if (error.response?.status == 406) {
                        return ResponseType.INVALID_CREDENTIALS;    
                    }else 
                    {
                        return ResponseType.SERVER_ERROR;
                    }
                    
                }
                else {
                    Alert.alert(error as string);

                    return ResponseType.UNKNOWN_ERROR;
                }
            }
        }

        try {

            // returns true
            let res = await axios.get(apiURL + '/user/', { headers: { "Authorization": user.accessToken } });

            return ResponseType.OK;

        } catch (err) {

            //TODO clear the stored user and redirect the user to the login page 
            return ResponseType.INVALID_ACCESS_TOKEN;
        }

    }


}

//request interceptor to add the auth token header to requests
export default Api.interceptors.request.use(async req => {

    if (!AuthUtils.attemptAuthentication()) {
        return req;
    }

    let user: User = await AuthUtils.getStoredUser();

    if (user.accessToken == undefined || user.accessTokenBirth == undefined) {
        throw new AuthError(AuthUtils.AUTH_STORE_MISSING_FIELDS_ERROR_MSG);
    }

    // if this token is 5 mins old, then refresh it
    // if the refresh attempt fails, the user will be redirected to the login page
    var tokenAge = Math.abs(new Date().getTime() - user.accessTokenBirth);
    if (tokenAge > 300000) { // 5 mins

        // prevents refreshing token whilst refresh token is in progress
        user.accessTokenBirth = new Date().getTime();

        let res: AxiosResponse = await axios.get(apiURL + "/user/refresh", {
            headers: {
                "Authorization": user.accessToken
            }
        });


        user.accessToken = res.data;

        if (req.headers != undefined && user.accessToken) {
            req.headers.authorization = user.accessToken;
        }

        // store the updated user object
        AuthUtils.setStoredUser(user);
    }

    return req;
});

