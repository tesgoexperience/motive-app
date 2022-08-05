import axios, { AxiosError, AxiosResponse } from "axios";
import { setItemAsync, deleteItemAsync, getItemAsync } from 'expo-secure-store';
import { Alert } from "react-native";
import { AuthError } from "./Errors";
import AuthUtils, {ResponseType, User} from '../util/AuthUtils'

// TODO move to environment variable
const apiURL = "http://192.168.0.41:8080"

const Api = axios.create({
    baseURL: apiURL
})

/**
 * Attaches access token to every request
 * 
 */
Api.interceptors.request.use(async req => {

    let res: ResponseType = await AuthUtils.attemptAuthentication();

    if (res != ResponseType.OK) {
        return req;
    }

    let user: User = await AuthUtils.getStoredUser();

    if (req.headers != undefined) {
        req.headers.authorization = user.accessToken;
    }


});

export default Api;