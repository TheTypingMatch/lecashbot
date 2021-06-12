import crypto from 'crypto';

const randomString = (length: number) => crypto.randomBytes(length).toString();

export default randomString;
