const utils = require('@modules/utils')

module.exports = {
	name: 'help',
}

module.exports.categorySelector = {
    async execute(interaction, client) {
        let categories = utils.getCommandCategories()
        if (!categories.includes(interaction.values[0])) return
        let commands = utils.getCommandFiles(interaction.values[0])
        let list = []
        for (const command of commands) {
            let content = utils.getCommand(interaction.values[0], command)
            list.push(`\`${content.name}\` • *${content.description}*`)
        }
        await interaction.update({ embeds: [utils.embed({
            preset: 'default',
            title: `\`${utils.title(interaction.values[0])}\` Help Menu`,
            description: `\`${commands.length}\` commands\n\n${list.join('\n')}`,
        })] })
    },
}