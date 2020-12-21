<h1 align="center">
  <img src="https://cdn.discordapp.com/attachments/689241653516435495/726905204351696946/lecashbot.png" align="center" />
  <br><br>
</h1>
<h3 align="center">
  A Discord.js bot based on the <a href="https://www.nitrotype.com/">NitroType</a> currency.
</h3>
<p align="center">
  <img src="https://img.shields.io/discord/689241652916912138?style=flat">
  <img src="https://img.shields.io/github/contributors/TheTypingMatch/le-cash-bot?style=flat">
  <img src="https://github.com/TheTypingMatch/lecashbot/workflows/Test/badge.svg?branch=master">
  <img src="https://img.shields.io/github/v/release/TheTypingMatch/le-cash-bot?include_prereleases&style=flat">
</p>
<p align="center">
  <a href="#commands">Commands</a>
  <span>-</span>
  <a href="#contribute">Contribute</a>
  <span>-</span>
  <a href="#contributors">Contributors</a>
</p>

## Commands

### Register
- `$register` - Make a profile using your NitroType account.
- `$delete` - Delete your LeCashBot account.

### Guides
- `$invite` - Invite the bot.
- `$info` - Important bot information.
- `$stats` - Show the bot servers/users and latency.
- `$uptime`  - Show the bot uptime.
- `$faq`  - Display frequently asked questions.
- `$ping`  - Show bot latency.
- `$donate`  - Display donators.
- `$contributors`  - Display contributors.

### Economy
- `$bal` - View yours or another user's balance.
- `$give` - Gift someone cash from your balance.
- `$daily`  - Collect a daily bonus of cash based on your daily streak.
- `$total`  - View the amount of cash there exists in the economy.
- `$profile` - View yours or another user's profile.
- `$withdraw` - Withdraw at least $100K from your LeCashBot account to your NitroType account.
- `$leaderboard`  - View the wealthiest of all LeCashBot users.

### Games
- `$bet` - Play roulette for a chance to win cash.
- `$coinflip`  - Earn cash based on a coin flip streak.
- `$lottery` - Enter a daily/weekly/monthly lottery for a chance to win the jackpot.

### Miscellaneous
- `$report` - Get a link for bug report.
- `$suggest` - Get a link for feature suggestions.

## Contribute
1. Fork the repository
2. Clone the repository & install required dependencies:
```
$ git clone git@github.com:YOUR_GITHUB_USERNAME/lecashbot.git
$ yarn install
```

**Local Bot Development Setup**
<br>
Testing the application using a database on your own machine will require a localhost database setup:

1. Create a `.env` in the root directory of the repository.
2. Inside of the `.env` file, include the following:
```
TOKEN="<token>"
URI="<uri>"
```
Replace `<uri>` and `<token>` with your MongoDB database connection URI and bot token.

**Running The Bot**
```
yarn build
yarn dev:server
```
...or alternatively:
```
cd scripts
sh start.sh
```
...or on Windows:
```
cd scripts
./start
```

**Making Changes**
```
yarn dev:lint
yarn dev:test
git status
git add .
git commit -m "COMMIT MESSAGE HERE"
git push
```

### Prerequisites
- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/)
- [Discord.js](https://discord.js.org/#/)

## The Team
<table>
  <tr>
    <th><a href="https://github.com/Le-SirH">Le-SirH</a></th>
    <th><a href="https://github.com/DamienVesper">DamienVesper</a></th>
    <th><a href="https://github.com/Techy">Techy</a></th>
    <th><a href="https://github.com/Dapp3rDuck">Dapp3rDuck</a></th>
  </tr>
  <tr>
    <td><img width="150" src="https://avatars3.githubusercontent.com/u/46948579?s=460&v=4"></td>
    <td><img width="150" src="https://avatars3.githubusercontent.com/u/34838468?s=400&v=4"></td>
    <td><img width="150" src="https://avatars2.githubusercontent.com/u/52178694?s=460&u=f059bd53f361aac4a57f0f88344ab401ca025f9d&v=4"></td>
    <td><img width="150" src="https://avatars2.githubusercontent.com/u/55905788?s=400&u=19f494db31898092c42090499306f60bbeaaaf0a&v=4"></td>
  </tr>
  <tr>
    <td align="center">Project Manager</td>
    <td align="center">Developer</td>
    <td align="center">Developer</td>
    <td align="center">Developer</td>
  </tr>
</table>

### Contributors
<table>
  <tr>
    <th><a href="https://github.com/iwa">iwa</a></th>
    <th><a href="https://github.com/valkyrienyanko">valkyrienyanko</a></th>
    <th><a href="https://github.com/Ray-Adams">Ray-Adams</a></th>
    <th><a href="https://github.com/TheProdigyHenry">TheProdigyHenry</a></th>
    <th><a href="https://github.com/zaidothePotato">zaidothePotato</a></th>
    <th><a href="https://github.com/mcglasses02">mcglasses02</a></th>
  </tr>
  <tr>
    <td><img width="100" src="https://avatars1.githubusercontent.com/u/19956672?s=400&u=6e5c9c141312928197d0accaa946a2568ce30ad6&v=4"></td>
    <td><img width="100" src="https://avatars2.githubusercontent.com/u/6277739?s=400&u=26cf9cce6417172cde64b0e02ecc594c5f4eecc2&v=4"></td>
    <td><img width="100" src="https://avatars1.githubusercontent.com/u/63924749?s=460&u=08bdc33558f70902f6b4be58a28ee81e0e6de16d&v=4"></td>
    <td><img width="100" src="https://avatars0.githubusercontent.com/u/55813024?s=400&u=0a548d57a94850fa52e363bd7c55008718659f83&v=4"></td>
    <td><img width="100" src="https://avatars2.githubusercontent.com/u/63223305?s=400&v=4"></td>
    <td><img width="100" src="https://avatars2.githubusercontent.com/u/64054183?s=400&v=4"></td>
  </tr>
  <tr>
    <td align="center">Contributor</td>
    <td align="center">Contributor</td>
    <td align="center">Contributor</td>
    <td align="center">Tester</td>
    <td align="center">Tester</td>
    <td align="center">Tester</td>
  </tr>
