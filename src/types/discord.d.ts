import * as Discord from 'discord.js';

interface Command {
    name: string;
    desc: string;
    usage?: string;
    aliases?: string[];
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
    Event
};
