import { log } from './log';

const checkErr = (err, client, success) => {
    if (err) return log(`error`, err, client);
    else if (success) return success();
};

export { checkErr };
