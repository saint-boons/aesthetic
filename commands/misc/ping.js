const utils = require('@modules/utils')

module.exports = {
    name: 'ping',
	description: 'Check the bot\'s and api latency',
	async execute(interaction, client) {
        const ping = new Date().getTime() - interaction.createdTimestamp
		return await interaction.editReply({ embeds: [utils.embed({
			preset: 'default',
			title: `Ping Results`,
			description: `Here are the detailed ping results.`,
			fields: [
				{ name: 'Bot Latency', value: `\`\`\`${ping} ms\`\`\``, inline: true },
				{ name: 'API Latency', value: `\`\`\`${client.ws.ping} ms\`\`\``, inline: true },
			]
		})] })
	},
}