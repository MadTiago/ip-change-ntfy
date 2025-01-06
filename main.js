const fs = require("fs");
const axios = require("axios");
const cron = require("node-cron");

require("dotenv").config();

// Configuration
const PUBLIC_IP_API = "https://api.ipify.org?format=json";
const IP_FILE = "./last_ip.txt";

const CRON_SCHEDULE = process.env.CRON_SCHEDULE;
const NTFY_SERVER = process.env.NTFY_SERVER;
const NTFY_TOPIC = process.env.NTFY_TOPIC;
const NTFY_URL = `${NTFY_SERVER}${NTFY_TOPIC}`;

async function getPublicIP() {
    const response = await axios.get(PUBLIC_IP_API);
    return response.data.ip;
}

async function sendNotification(oldIP, newIP) {
    await axios.post(NTFY_URL, `Your public IP has changed from ${oldIP} to ${newIP}`, {
        headers: {
            Title: "Public IP Changed",
            Tags: "rotating_light",
        },
    });
}

function consoleLog(str, error = false) {
    const date = new Date().toLocaleString();
    const out = `[${date}] ${str}`;
    if (!error) {
        console.log(out);
    } else {
        console.error(out);
    }
}

async function cycle() {
    try {
        const currentIP = await getPublicIP();

        let lastIP = undefined;
        if (fs.existsSync(IP_FILE)) {
            lastIP = fs.readFileSync(IP_FILE, "utf-8");
        }
        lastIP = lastIP !== undefined ? lastIP : "unknown";

        // Compare and notify if the IP has changed
        if (currentIP !== lastIP) {
            consoleLog(`IP changed from ${lastIP} to ${currentIP}`);
            await sendNotification(lastIP, currentIP);

            // Save the current IP to the file
            fs.writeFileSync(IP_FILE, currentIP, "utf-8");
        } else {
            //consoleLog("IP has not changed.");
        }
    } catch (error) {
        consoleLog(`Error checking or sending notification:\n${error.message}`, true);
    }
}

(() => {
    // Run 1 time to setup IP
    cycle();

    // On the clock, baby
    cron.schedule(CRON_SCHEDULE, () => {
        cycle();
    });
})();
