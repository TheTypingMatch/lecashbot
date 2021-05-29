<img align="right" width="400" src="https://cdn.discordapp.com/attachments/689241653516435495/726905204351696946/lecashbot.png" />
<h1>LeCashBot</h1>
<p>
  <img src="https://img.shields.io/discord/689241652916912138?style=flat">
  <img src="https://github.com/TheTypingMatch/lecashbot/workflows/Build/badge.svg">
  <img src="https://github.com/TheTypingMatch/lecashbot/workflows/Lint/badge.svg">
</p>
<p>
  A Discord.js bot based on the <a href="https://www.nitrotype.com/">NitroType</a> currency.
</p>

## Commands

###### Register
- `$register` - Make a profile using your NitroType account.
- `$delete` - Delete your LeCashBot account.

###### Guides
- `$invite` - Invite the bot.
- `$info` - Important bot information.
- `$stats` - Show the bot servers/users and latency.
- `$uptime`  - Show the bot uptime.
- `$faq`  - Display frequently asked questions.
- `$ping`  - Show bot latency.
- `$donate`  - Display donators.
- `$contributors`  - Display contributors.

###### Economy
- `$bal` - View yours or another user's balance.
- `$give` - Gift someone cash from your balance.
- `$daily`  - Collect a daily bonus of cash based on your daily streak.
- `$total`  - View the amount of cash there exists in the economy.
- `$profile` - View yours or another user's profile.
- `$withdraw` - Withdraw at least $100K from your LeCashBot account to your NitroType account.
- `$leaderboard`  - View the wealthiest of all LeCashBot users.

###### Games
- `$bet` - Play roulette for a chance to win cash.
- `$coinflip`  - Earn cash based on a coin flip streak.
- `$lottery` - Enter a daily/weekly/monthly lottery for a chance to win the jackpot.

###### Miscellaneous
- `$report` - Get a link for bug report.
- `$suggest` - Get a link for feature suggestions.

## Prerequisites
| Name | Installation | Documentation |
| --- | --- | --- |
| Node.js | [nodejs.org/en/download](https://nodejs.org/en/download/) | [nodejs.org/en/docs](https://nodejs.org/en/docs/) |
| MongoDB | [docs.mongodb.com/manual/installation](https://docs.mongodb.com/manual/installation/) | [docs.mongodb.com](https://docs.mongodb.com/) |
| Discord.js | *N/A* | [discord.js.org/#/docs](https://discord.js.org/#/docs/main/master/general/Welcome) |

## Contributing
1. Fork the repository
2. Clone the repository & install required dependencies:
```bash
git clone git@github.com:YOUR_GITHUB_USERNAME/lecashbot.git
yarn install
```

### Setup
> NOTE: Testing the application using a database on your own machine will require a localhost [MongoDB](https://www.mongodb.com/cloud/atlas) database setup.

1. Create a `.env` in the root directory of the repository.
2. Inside of the `.env` file, include the following:
```
TOKEN="<token>"
URI="<uri>"
```
Replace `<uri>` and `<token>` with your MongoDB database connection URI and bot token.
3. Run the bot.
```bash
yarn start
```
