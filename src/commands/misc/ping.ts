import { CommandInteraction, Client, SlashCommandBuilder } from 'discord.js';

import { embedPreset } from '@/modules/utils';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot\'s and api latency'),
    execute: async (client: Client, interaction: CommandInteraction) => {
        await interaction.reply({
            embeds: [
                embedPreset()
                    .setTitle(`Ping Results`)
                    .setDescription(`Here are the detailed ping results.`)
                    .addFields(
                        { name: 'Bot Latency', value: `\`\`\`${new Date().getTime() - interaction.createdTimestamp} ms\`\`\``, inline: true },
                        { name: 'API Latency', value: `\`\`\`${client.ws.ping} ms\`\`\``, inline: true },
                    )
            ]
        });
        return
    }
};