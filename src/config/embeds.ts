const helpInfo = {
    desc: "A Discord.js bot based on the NitroType currency.\nPlease consider supporting the bot by [**donating here**](https://patreon.lecashbot.cf)!\n[**Invite**](https://invite.lecashbot.cf/) the bot.",
    descInfo: "`$help Register`\n`$help Guides`\n`$help Economy`\n`$help Games`\n`$help Misc`",
    register: {
        register: "`<nt-username>` - Make a profile using your NitroType account.",
        delete: "`<discord-id>` - Delete your LeCashBot account."
    },
    guides: {
        invite: " - Invite the bot.",
        info: " - Important bot information.",
        stats: " - Show the bot servers/users and latency.",
        uptime: " - Show the bot uptime.",
        faq: " - Display frequently asked questions.",
        ping: " - Show bot latency.",
        donate: " - Display donators.",
        contributors: " - Display contributors."
    },
    economy: {
        bal: "`<user>` - View yours or another user's balance.",
        give: "`<user>` `<amount>` - Gift someone cash from your balance.",
        daily: " - Collect a daily bonus of cash based on your daily streak.",
        total: " - View the amount of cash there exists in the economy.",
        profile: "`<user>` - View yours or another user's profile.",
        withdraw: "`<amount>` - Withdraw at least $100K from your LeCashBot account to your NitroType account.",
        leaderboard: " - View the wealthiest of all LeCashBot users."
    },
    games: {
        bet: "`<amount>` - Play roulette for a chance to win cash.",
        coinflip: " - Earn cash based on a coin flip streak.",
        lottery: " - Enter a daily/weekly/monthly lottery for a chance to win the jackpot."
    },
    misc: {
        report: " - Get a link for bug report.",
        suggest: " - Get a link for feature suggestions."
    }
};

const info = {
    general: {
        author: "**Author** - [**LeSirH**](https://patreon.lecashbot.cf/)",
        logoCreator: "**Logo Creator** - Try2Win4Glory",
        creationDate: "**Creation Date** - June 7, 2019",
        prefix: "**Prefix** - $ (non-configurable)"
    },
    contribute: {
        msg: "Want to contribute to LeCashBot?",
        patreon: "Support the [**Patreon**](https://patreon.lecashbot.cf).",
        questions: "Need help? Ask your questions [**here**](https://github.com/TheTypingMatch/lecashbot/discussions/new).",
        link: "Star me on **[GitHub](https://github.com/TheTypingMatch/lecashbot)**!",
        server: "\nJoin the **[LeCashBot Support Discord](https://discord.gg/UspVEng)**."
    },
    invite: {
        invite: "Invite LeCashBot [**here**](https://invite.lecashbot.cf/)."
    }
};

const donate = {
    donateLink: "Donate to LeCashBot **[here](https://donate.lecashbot.cf)**"
};

const faqInfo = [
    {
        q: "How do I earn NitroType cash?",
        a: "Make sure you have signed up for the bot and you will be earning money straight away just by chatting in any Discord server you share LeCashBot with! You can also earn cash with other bot games & commands. (See `$help`)"
    },
    {
        q: "I found a bug! Where do I report it?",
        a: "LeCashBot bugs may be reported [**here**](https://github.com/TheTypingMatch/le-cash-bot/issues/new/choose)."
    },
    {
        q: "Can I add this bot to my server?",
        a: "You may invite LeCashBot using the `$invite` command."
    },
    {
        q: "How do I sign up for the bot/How do I start earning money?",
        a: "Use the `$register` command with your NitroType profile link. \nFor example: `$register https://www.nitrotype.com/racer/mrh110`."
    },
    {
        q: "How can I contribute to the bot?",
        a: "If you would like to help out with the bot, it is recommended you join the Discord through `$info` or check our [**GitHub**](https://github.com/TheTypingMatch/le-cash-bot)."
    },
    {
        q: "How much money does LeCashBot have and where does it come from?",
        a: "Its money comes from many donators that can be viewed with `$donate`."
    },
    {
        q: "How can I get a contribution badge?",
        a: "The available contribution badges include developer, tester, and donor. To earn the developer badge, you must contribute to LeCashBot's repository [**here**](https://github.com/TheTypingMatch/le-cash-bot). The tester badge is achievable by helping out with testing new features in the [**LeCashBot Discord**](https://discord.gg/UspVEng)."
    },
    {
        q: "I have a question that isn't listed here. Who can I ask?",
        a: "We have a [**discussions page**](https://github.com/TheTypingMatch/lecashbot/discussions/new) where you can ask your questions."
    }
];

export { faqInfo, donate, info, helpInfo };
