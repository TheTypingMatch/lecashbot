import * as formatDuration from 'format-duration'

const format = (msg, client, args) => msg.reply(formatDuration(client.uptime))

export default format
