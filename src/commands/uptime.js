import * as formatDuration from 'format-duration';

export default (msg, client, args) => msg.reply(formatDuration(client.uptime));
