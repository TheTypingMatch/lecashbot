import * as Discord from 'discord.js';

interface Command {
    name: string;
    desc: string;
    usage: string;
    aliases: string[];
    run: any;
}

interface Event {
    
}

interface Client extends Discord.Client {
    commands?: Command[];
    events?: Event[];
}

export {
    Client
};
