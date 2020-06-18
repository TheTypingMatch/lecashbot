import { log } from './log'

const checkErr = (err, client, success) => {
    if (err) log('error', err, client)
    else if (success) success()
}

export { checkErr }
