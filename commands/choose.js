const { Message } = require("discord.js");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message 
     */
    async execute(message) {
        if (message.author.bot) return;

        if (message.content.startsWith("~choose")) {
            const args = message.content.slice("~choose".length).trim().split(",");
            if (args.length < 2) {
                message.channel.send(`<@${message.author.id}>, hãy cung cấp ít nhất hai lựa chọn.`);
                return;
            }
            const choice = args[Math.floor(Math.random() * args.length)].trim();
            message.channel.send(`<@${message.author.id}>, tôi chọn: ${choice}`);
        }
    }
};
