# Stork-Auto-Bot
## This is a bot used to verify Stork Oracle's signed price data. It periodically fetches signed price data from the API and verifies its validity.

## 📢 Join Our Community

# Telegram Channel: .[Channel](https://t.me/Offical_Im_kazuha)
# GitHub Repository: [Stork](https://github.com/Kazuha787/Stork-Auto-Bot.git)

### Installation:

1️⃣  Clone this repository to your local machine:
```
git clone https://github.com/Kazuha787/Stork-Auto-Bot.git && cd Stork-Auto-Bot
```

2️⃣ Install dependencies:
```
npm install 
```

3️⃣ edit the account 
```
nano accounts.js
```


2. Edit the generated `accounts.js` file with your credentials:
```javascript
export const accounts = [
  { username: "email1", password: "pass1" },
  { username: "email2", password: "pass2" }
];
```

3. Replace `username` and `password` with your Stork Oracle account credentials.
just add new line if you wanna run many accounts

### Optional: Proxy Configuration

To use proxy servers for distribution of requests:

1. Create a `proxies.txt` file in the project root
2. Add one proxy per line in any of these formats:
   - HTTP proxies: `http://user:pass@host:port`
   - SOCKS proxies: `socks5://user:pass@host:port`

## Usage

5️⃣ Run the bot:
```
node index.js
```
➕ to detach screen **Ctrl + A, Then Click D**

➕ to Attach `screen -r stork-bot`


⚠️ Note:
This bot is for educational purposes only. Use at your own risk and ensure compliance with Stork's terms of service.
