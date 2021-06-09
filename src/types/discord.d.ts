import * as Discord from 'discord.js';

interface CommandConfig {
    desc: string;
    category: string;
    usage?: string;
    aliases?: string[];
}
interface Command {
    name: string;
    admin: boolean;
    config: CommandConfig;
    run: any;
}

interface Event {
    name: string;
    callback: any;
}

interface Client extends Discord.Client {
    commands?: Command[];
    events?: Event[];
}

export {
    Client,
    Command,
    CommandConfig,
    Event
};
