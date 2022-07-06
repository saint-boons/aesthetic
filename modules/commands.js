const { Collection } = require('discord.js')
const utils = require('@modules/utils')
const logger = require('@modules/logger')

module.exports = async (client) => {
    client.commands = new Collection()
    let commandFiles = utils.getCommandFiles('')
    for (const file of commandFiles) {
        console.log(file)
        let command = require(`@commands/${file}`)
        client.commands.set(command.name, command)
    }
    let commandFolders = utils.getCommandCategories()
    for (const folder of commandFolders) {
        let content = utils.getCommandFiles(folder)
        if (content) {
            for (const file of content) {
                let command = require(`@commands/${folder}/${file}`)
                client.commands.set(command.name, command)
            }
        }
    }


    client.interactions = new Collection()
    let interactionFiles = utils.getInteractionFiles('')
    for (file of interactionFiles) {
        let interaction = require(`@interactions/${file}`)
        client.interactions.set(interaction.name, interaction)
    }
    let interactionFolders = utils.getInteractionCategories()
    for (folder of interactionFolders) {
        let content = utils.getInteractionFiles(folder)
        if (content) {
            for (file of content) {
                let interaction = require(`@interactions/${folder}/${file}`)
                client.interactions.set(interaction.name, interaction)
            }
        }

    }

    client.on('interactionCreate', async interaction => {
        switch (interaction.type) {
            case 'APPLICATION_COMMAND':
                const command = client.commands.get(interaction.commandName)

                if (!command) return

                await interaction.deferReply()

                try {
                    await command.execute(interaction, client);
                } catch (err) {
                    logger.error(err);
                    await interaction.reply({
                        embeds: [utils.embed({
                            preset: 'error',
                            title: 'Unknown Error',
                            description: `There was an error while processing this command. Please contact an administrator and try again later.`,
                        })], ephemeral: true
                    });
                }
                return
            case 'MESSAGE_COMPONENT':
                let category = interaction.customId.replace(/:([\s\S]*)$/, '')
                let id = interaction.customId.replace(/([\s\S]*):/, '')
                if (!client.interactions.has(category)) return
                if (interaction.user.id !== interaction.message.interaction.user.id) return await interaction.reply({
                    embeds: [utils.embed({
                        preset: 'error',
                        title: 'Wrong User',
                        description: `You cannot interact with this element. It is not meant for you.`,
                    })], ephemeral: true
                });

                try {
                    await client.interactions.get(category)[id].execute(interaction, client)
                } catch (err) {
                    console.error(err);
                    await interaction.reply({
                        embeds: [utils.embed({
                            preset: 'error',
                            title: 'Unknown Error',
                            description: `There was an error while processing this interaction.`,
                        })], ephemeral: true
                    });
                }
                return
            default:
                return
        }
    })
}