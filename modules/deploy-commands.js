const fs = require('node:fs')
const path = require('node:path')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const logger = require('@modules/logger')
const rest = new REST({ version: '9' }).setToken(process.env.TOKEN)

module.exports = async (client) => {
    const guilds = await client.guilds.fetch()
    const commands = client.commands.map(({ execute, ...data }) => data)

    for (const guild of guilds) {
        rest.put(Routes.applicationGuildCommands(client.user.id, guild[1].id), { body: commands })
	        .then(() => logger.info(`Successfully registered application commands for ${guild[1].id}.`))
	        .catch(logger.error)
    }
}