const axios = require('axios');
const fs = require('fs');
const userAgent = require('user-agents');

// Function to create a delay (for animations)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to create a cool typing effect
async function typeEffect(text, delay = 50) {
    for (const char of text) {
        process.stdout.write(char);
        await sleep(delay);
    }
    console.log();
}

// Function to create a spinning loader animation
async function loadingAnimation(text, duration = 3000) {
    const frames = ['|', '/', '-', '\\'];
    const startTime = Date.now();
    let i = 0;

    process.stdout.write(`${text} `);
    while (Date.now() - startTime < duration) {
        process.stdout.write(`\r${text} ${frames[i++ % frames.length]}`);
        await sleep(100);
    }
    process.stdout.write("\r✅ Done!         \n");
}

// Banner Animation
async function showBanner() {
    console.clear();
    await typeEffect(`
██╗  ██╗ █████╗ ███████╗██╗   ██╗██╗  ██╗ █████╗  
██║ ██╔╝██╔══██╗╚══███╔╝██║   ██║██║  ██║██╔══██╗ 
█████╔╝ ███████║  ███╔╝ ██║   ██║███████║███████║ 
██╔═██╗ ██╔══██║ ███╔╝  ██║   ██║██╔══██║██╔══██║ 
██║  ██╗██║  ██║███████╗╚██████╔╝██║  ██║██║  ██║ 
╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ 
`, 5);

    console.log("✨ Author  : Kazuha");
    console.log("🔗 GitHub  : https://github.com/Kazuha787");
    console.log("📢 Telegram: https://t.me/Offical_Im_kazuha");
    console.log("============================================\n");
}

const API_BASE_URL = "https://app-api.jp.stork-oracle.network/v1";

// Read tokens from token.txt
const tokens = fs.readFileSync('token.txt', 'utf-8')
    .trim()
    .split('\n')
    .map(token => token.trim());

// Function to generate headers with a random User-Agent
function generateHeaders(authToken) {
    return {
        "Authorization": `Bearer ${authToken.replace("Bearer ", "").trim()}`,
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
        "User-Agent": new userAgent().toString(),
        "Content-Type": "application/json"
    };
}

// Function to get account info
async function fetchMe(authToken) {
    try {
        await loadingAnimation("🔍 Fetching user info", 2000);
        const response = await axios.get(`${API_BASE_URL}/me`, {
            headers: generateHeaders(authToken)
        });

        const email = response.data.data.email || "Unknown Email";
        const validCount = response.data.data.stats?.stork_signed_prices_valid_count || 0;

        return { email, validCount };
    } catch (error) {
        console.error("\n❌ Error fetching user info:", error.response?.data || error.message);
        return { email: "Unknown Email", validCount: 0 };
    }
}

// Function to fetch latest prices from Stork Oracle API
async function fetchPrices(authToken) {
    try {
        await loadingAnimation("💰 Fetching latest prices", 2000);
        const response = await axios.get(`${API_BASE_URL}/stork_signed_prices`, {
            headers: generateHeaders(authToken)
        });

        const data = response.data.data;
        const firstAssetKey = Object.keys(data)[0];
        const msgHash = data[firstAssetKey]?.timestamped_signature?.msg_hash;

        return msgHash;
    } catch (error) {
        console.error("\n❌ Error fetching prices:", error.response?.data || error.message);
        return null;
    }
}

// Function to validate price
async function validatePrice(authToken, msgHash) {
    try {
        await loadingAnimation("🔄 Validating price", 2500);
        await axios.post(`${API_BASE_URL}/stork_signed_prices/validations`, 
            { msg_hash: msgHash, valid: true },
            { headers: generateHeaders(authToken) }
        );

        console.log("✅ Validation successful!\n");
    } catch (error) {
        console.error("\n❌ Error validating data:", error.response?.data || error.message);
    }
}

// Main function for one account
async function runAccount(authToken, index) {
    console.log(`\n🔹 Processing Account ${index + 1} 🔹`);

    const { email, validCount } = await fetchMe(authToken);
    console.log(`📧 Email: ${email}`);
    
    const msgHash = await fetchPrices(authToken);
    if (msgHash) {
        await validatePrice(authToken, msgHash);
    }

    console.log(`✅ Verified messages: ${validCount}`);
    console.log(`🔹 Finished Account ${index + 1} 🔹\n`);
}

// Main loop to run accounts one by one
async function main() {
    await showBanner();
    
    while (true) {
        for (let i = 0; i < tokens.length; i++) {
            await runAccount(tokens[i], i);
            console.log("⏳ Waiting 3 seconds before next account...");
            await sleep(3000); 
        }
    }
}

// Start the script
main();
