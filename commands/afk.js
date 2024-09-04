const { MessageActionRow, MessageButton } = require('discord.js');
const BTC = ["1015763488938938388", "1112683447366991923", "1055695302386012212", "1157629753742856222", "948220309176221707", "1143200917097808044", "1236505346814644326"];

const afkUsers = new Map(); // Global AFK status
const afkServerUsers = new Map(); // Server-specific AFK status

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        // Handle AFK status removal when the user sends a message
        if (afkUsers.has(message.author.id)) {
            afkUsers.delete(message.author.id);
            message.channel.send(`<a:hc_BirbDa:1254079055389523978> Welcome back, <@${message.author.id}> is no longer AFK globally.`);
        } else if (afkServerUsers.has(`${message.guild.id}-${message.author.id}`)) {
            afkServerUsers.delete(`${message.guild.id}-${message.author.id}`);
            message.channel.send(`<a:hc_BirbDa:1254079055389523978> Welcome back, <@${message.author.id}> is no longer AFK in this server.`);
        }

        // Check if message mentions an AFK user
        message.mentions.users.forEach((user) => {
            if (afkUsers.has(user.id)) {
                const reason = afkUsers.get(user.id);
                const replyMessage = BTC.includes(user.id)
                    ? `<a:hc_Diamond2:1250764691219681350> Sorry for the inconvenience, <@${user.id}> is AFK globally for reason: **${reason}**. They will reply to you immediately after AFK.`
                    : `<:hc_vaiz:1255415541770879028> <@${user.id}> is currently AFK globally, the reason: ${reason}`;
                message.channel.send(replyMessage);
            } else if (afkServerUsers.has(`${message.guild.id}-${user.id}`)) {
                const reason = afkServerUsers.get(`${message.guild.id}-${user.id}`);
                const replyMessage = BTC.includes(user.id)
                    ? `<a:hc_Diamond2:1250764691219681350> Sorry for the inconvenience, <@${user.id}> is AFK in this server for reason: **${reason}**. They will reply to you immediately after AFK.`
                    : `<:hc_vaiz:1255415541770879028> <@${user.id}> is currently AFK in this server, the reason: ${reason}`;
                message.channel.send(replyMessage);
            }
        });

        if (message.content.startsWith("~afk")) {
            const reason = message.content.split(" ").slice(1).join(" ") || "AFK";

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('afk_global')
                        .setLabel('Globally')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('afk_server')
                        .setLabel('Server')
                        .setStyle('SECONDARY')
                );

            const afkMessage = await message.channel.send({
                content: "Which mode?",
                components: [row]
            });

            const filter = i => i.user.id === message.author.id;
            const collector = afkMessage.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                if (i.customId === 'afk_global') {
                    afkUsers.set(message.author.id, reason);
                    await i.update({ content: `<@${message.author.id}> is now AFK globally: ${reason}`, components: [] });
                } else if (i.customId === 'afk_server') {
                    afkServerUsers.set(`${message.guild.id}-${message.author.id}`, reason);
                    await i.update({ content: `<@${message.author.id}> is now AFK in this server: ${reason}`, components: [] });
                }
            });

            collector.on('end', collected => {
                if (!collected.size) {
                    afkMessage.edit({ content: 'No selection made. AFK mode was not set.', components: [] });
                }
            });
        }
    }
};
