import axios, { Method } from 'axios';

import cookie from 'cookie';
import qs from 'qs';

const baseURL = `https://www.nitrotype.com/api`;

const serializeCookies = (obj: any) => Object.entries(obj).reduce((str, [key, value]) => `${str} ${cookie.serialize(key, value)};`, ``);

class NTClient {
    credentials: {
        username: string
        password: string
    }

    cookies: any

    constructor (username: string, password: string) {
        this.credentials = {
            username,
            password
        };
    }

    sendRequest = (method: Method, path: string, options: any) => {
        const uhash = this.cookies.ntuserrem;

        return axios({
            method,
            baseURL,
            url: path,

            headers: { Cookie: serializeCookies(this.cookies) },
            params: { uhash, ...options },

            data: method === `POST` && qs.stringify({
                uhash,
                ...(options.data || null)
            })
        });
    }

    login = () => {
        axios.post(`${baseURL}/login`, {
            username: this.credentials.username,
            password: this.credentials.password
        }).then(({ headers }) => {
            for (const str of headers[`set-cookie`]) {
                const cookieObj = cookie.parse(str);
                const key = Object.keys(cookieObj)[0];

                this.cookies[key] = cookieObj[key];
            }
        });
    }

    get = (path: string, options: any) => {
    }
}

export default NTClient;
