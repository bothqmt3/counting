// commands/rd.js
const Discord = require("discord.js");

module.exports = {
    name: "messageCreate",
    execute: async (message) => {
        if (message.content.startsWith("~rd")) {
            const args = message.content.split(" ");
            if (args.length === 2) {
                const maxNumber = parseInt(args[1]);
                if (!isNaN(maxNumber)) {
                    const randomNumber = Math.floor(Math.random() * maxNumber) + 1;
                    const embed = new Discord.MessageEmbed()
                        .setColor("#00ff00")
                        .setDescription(`<@${message.author.id}>, Your Number Is: ${randomNumber}`);
                    message.channel.send({ embeds: [embed] });
                    return;
                }
            }
        }
    },
};
