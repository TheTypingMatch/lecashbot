import axios from 'axios';
import cookie from 'cookie';

const baseURL = `https://www.nitrotype.com/api`;

class NTClient {
    credentials: {
        username: string
        password: string
    }

    constructor (username: string, password: string) {
        this.credentials = {
            username,
            password
        };
    }

    login = () => {
        axios.post(`${baseURL}/login`, {
            username: this.credentials.username,
            password: this.credentials.password
        }).then(({ headers }) => {
            for (const str of headers[`set-cookie`]) {
                const cookieObj = cookie.parse(str);
            }
        });
    }
}

export default NTClient;
