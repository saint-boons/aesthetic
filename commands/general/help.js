const utils = require('@modules/utils')

module.exports = {
    name: 'help',
    description: 'Get a complete command list and usage on a specific command',
    options: [{
        name: 'command',
        type: 3,
        description: 'Command to get more details about',
        required: false,
    }],
    async execute(interaction, client) {
        if (interaction.options.getString('command')) {
            const command = interaction.options.getString('command').toLowerCase()
            if (!client.commands.has(command)) return await interaction.editReply({
                embeds: [utils.embed({
                    preset: 'error',
                    title: 'Unknown Command',
                    description: `The command \`${command}\` does not exsist.`,
                })]
            })
            let commandFetched = await client.commands.get(command)
            let options = []
            if (commandFetched.options) {
                for (const option of commandFetched.options) {
                    let required = option.required ? '*****' : ''
                    options.push(`\`${option.name}\`${required} • *${option.description}*`)
                }
            } else {
                options.push(`*There is are options for this command.*`)
            }
            return await interaction.editReply({
                embeds: [utils.embed({
                    preset: 'default',
                    title: `\`${command}\` Command Help Menu`,
                    fields: [
                        { name: `Description`, value: `*${commandFetched.description}*`, inline: true },
                        { name: `Options`, value: options.join('\n'), inline: false }
                    ]
                })]
            })
        } else {
            let options = []
            let categories = utils.getCommandCategories()
            for (const category of categories) {
                options.push({
                    label: utils.title(category),
                    description: `Show ${category} commands`,
                    value: category
                })
            }
            let fields = []
            for (const category of categories) {
                let commandFiles = utils.getCommandFiles(category)
                if (commandFiles) {
                    fields.push({
                        name: utils.title(category),
                        value: `\`${commandFiles.length}\` commands`,
                        inline: true
                    })
                }

            }

            return await interaction.editReply({
                embeds: [utils.embed({
                    preset: 'default',
                    title: 'Help Menu',
                    description: 'Select a category using the select menu below.',
                    fields: fields,
                })], components: [utils.row([utils.menu({
                    id: 'help:categorySelector',
                    placeholder: 'Select a category',
                    options: options
                })])]
            })
        }
    },
}