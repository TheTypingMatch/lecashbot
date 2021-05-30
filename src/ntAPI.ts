import axios, { Method, AxiosResponse } from 'axios';

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

        this.cookies = {};
    }

    sendRequest = async (method: Method, path: string, options?: any) => {
        const uhash = this.cookies.ntuserrem;

        return await axios({
            method,
            baseURL,
            url: path,

            headers: {
                Cookie: serializeCookies(this.cookies) // ,
                // 'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36`,
                // origin: baseURL*/
            },

            params: { uhash, ...options },
            data: method === `POST` && qs.stringify({
                uhash,
                ...(options ? options.data || null : null)
            })
        });
    }

    login = async () => {
        return await this.sendRequest(`POST`, `/login`, {
            username: this.credentials.username,
            password: this.credentials.password
        }).then((res: AxiosResponse) => {
            for (const str of res.headers[`set-cookie`]) {
                const cookieObj = cookie.parse(str);
                const key = Object.keys(cookieObj)[0];

                this.cookies[key] = cookieObj[key];
            }
        });
    }

    get = async (path: string, options?: any) => {
        return await this.sendRequest(`GET`, path, options || null);
    }

    post = async (path: string, options?: any) => {
        return await this.sendRequest(`POST`, path, options || null);
    }
}

export default NTClient;
