# **Efestus**

![GitHub repo size](https://img.shields.io/github/repo-size/aryxst/efestus)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/Aryxst/efestus)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Aryxst/efestus)

<img src="https://raw.githubusercontent.com/Aryxst/efestus-bot/master/docs/docs/assets/logo.jpg" width="300px" style="border-radius: 50%; overflow:hidden"/>

Efestus is a Discord bot confusing yet powerful because of the tools it was built with. Its written in full typescript and developed in the [Bun](https://bun.sh/) Runtime.

- ⚡ **Fast**: Efestus is built with Bun, the all-in-one Javascript runtime built for speed;
- 🚀 **Optimization First**: 
    - Database experience is enhanced by Bun's `sqlite` module;
- 🧪 **Customizable**: The codebase its quite simple to understand.


⚠️ Warning

    This project its still in very early stages, what is available now is barebones of what there will be in the future.
    Quick Note: You may want to sharply edit the source.

------
## **Installation**
Requirements: 

  * [Bun](https://bun.sh/) >= 1.0.26
  * Typescript >= 5.2
  * Windows, Linux(or WSL) or MacOS(not tested)
### Bun
Install [Bun](https://bun.sh/)
```bash
# on Linux & MacOS
curl https://bun.sh/install | bash
# on Windows
powershell -c "irm bun.sh/install.ps1 | iex"
```
Clone the repository
```bash
git clone https://github.com/aryxst/efestus-bot.git
```

Create a `.env` file at the root of the cloned repository with this format:
```ini
BOT_TOKEN=<YOUR BOT_TOKEN>
GUILD_ID=<YOUR GUILD_ID>
CLIENT_ID=<YOUR CLIENT_ID>
```
Run the following:
```bash
# Install dependencies
bun install --production
# Init DB
bun db:generate
bun db:migrate
# Run bot
bun run start
```
------
## **Contributing**

<u>Feel free</u> to open a pull request or an issue.
