import axios, { AxiosError } from "axios";

import AuthUtils, {ResponseType, UserAuthDetails} from './AuthUtils'

const API_URL = "http://192.168.0.116:8080"//process.env.REST_API;

const Api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

/**
 *
 * Attaches access token to every request
 *
 */
Api.interceptors.request.use(async req => {

    let res: ResponseType = await AuthUtils.attemptAuthentication();

    if (res != ResponseType.OK) {
        return req;
    }

    let user: UserAuthDetails = await AuthUtils.getStoredUser();

    if (req.headers != undefined) {
        req.headers.authorization = user.accessToken;
    }

    return req;

});

Api.interceptors.response.use(
    response => response,
    (error : AxiosError) => {
        // if this user makes a request they are not authorized for, log them out as their credentials are not valid
        if (error.response?.status == 401) {
            AuthUtils.logout();
        }
    }
)

export default Api;