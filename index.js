const { Client, Intents, Message } = require('discord.js');
const fetch = require('node-fetch');
const jsdom = require("jsdom");
const schedule = require('node-schedule');


const { JSDOM } = jsdom;
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on("message", function (message) {
    if (message.author.bot) return;

    if (message.content.toLowerCase().indexOf("lala") != -1) {
        message.reply("Les lalafell c'est les plus beaux ")
    }

    if (message.content === "!start cerberus") {

        let currentStatus = "";

        const job = schedule.scheduleJob('* * * * *', function () {
            checkCerberus()
                .then(status => {
                    console.log(status)
                    if (status !== currentStatus) {
                        console.log("status change")
                        message.reply("Le status est : "+status+" je t'avertirais si il change")
                        currentStatus = status
                    }
                })

        });

    }

})

client.login(process.env.BOT_TOKEN);

async function checkCerberus() {

    const selector = "div.js--tab-content:nth-child(7) > ul:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > div:nth-child(4) > i:nth-child(1)";

    return fetch("https://fr.finalfantasyxiv.com/lodestone/worldstatus/")
        .then(response => response.text()
        )
        .then(text => {
            const dom = new JSDOM(text);
            let isPossible = false;
            return dom.window.document.querySelector(selector).attributes.getNamedItem("data-tooltip").value;


        })
        .then(res => {
            return res
        })
}