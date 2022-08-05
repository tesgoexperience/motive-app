import axios from "axios";

import AuthUtils, {ResponseType, User} from '../util/AuthUtils'

// TODO move to environment variable
export const API_URL = "http://192.168.30.18:8080"

const Api = axios.create({
    baseURL: API_URL
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