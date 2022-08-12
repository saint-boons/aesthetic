import { ChatInputCommandInteraction, Client, SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder, MessageActionRowComponentBuilder, MessageComponentInteraction, SelectMenuInteraction } from 'discord.js';

import { commands, embedPreset, toTitleCase } from '@/modules/utils';

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get a complete command list and usage on a specific command')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('Command to get more details about')
                .setRequired(false)),
    execute: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const command = interaction.options.getString('command')?.toLowerCase()
        if (command) {
            if (!commands.collection.has(command)) return await interaction.reply({
                embeds: [
                    embedPreset('error')
                        .setTitle(`Unknown Command`)
                        .setDescription(`The command \`${command}\` does not exsist.`)
                ]
            })
            let commandFetched = await commands.collection.get(command)
            let options = []
            if (commandFetched.options) {
                for (const option of commandFetched.options) {
                    let required = option.required ? '*****' : ''
                    options.push(`\`${option.name}\`${required} • *${option.description}*`)
                }
            } else {
                options.push(`*There is are options for this command.*`)
            }
            return await interaction.reply({
                embeds: [
                    embedPreset()
                        .setTitle(`\`${command}\` Command Help Menu`)
                        .addFields([
                            { name: `Description`, value: `*${commandFetched.description}*`, inline: true },
                            { name: `Options`, value: options.join('\n'), inline: false }
                        ])
                ]
            })
        } else {
            let options = new Array
            for (const category of commands.categories) {
                options.push({
                    label: toTitleCase(category),
                    description: `Show ${category} commands`,
                    value: category
                })
            }

            let fields = new Array
            for (const category of commands.categories) {
                let commandFiles = commands.structure[category]
                if (commandFiles) {
                    fields.push({
                        name: toTitleCase(category),
                        value: `\`${commandFiles.length}\` commands`,
                        inline: true
                    })
                }

            }

            await interaction.reply({
                embeds: [
                    embedPreset()
                        .setTitle(`Help Menu`)
                        .setDescription(`Select a category using the select menu below.`)
                        .addFields(fields)
                ],
                components: [
                    new ActionRowBuilder<MessageActionRowComponentBuilder>()
                        .addComponents(
                            new SelectMenuBuilder()
                                .setCustomId('help:categorySelector')
                                .setPlaceholder('Select a category')
                                .addOptions(...options)
                        )
                ]
            })
            return
        }
    },
    categorySelector: async (client: Client, interaction: SelectMenuInteraction) => {
        if (!commands.categories.includes(interaction.values[0])) return

        let categoryCommands = commands.structure[interaction.values[0]]
        let list = []
        for (const command of categoryCommands) {
            let content = commands.collection.get(command).data
            list.push(`\`${content.name}\` • *${content.description}*`)
        }

        await interaction.update({
            embeds: [
                embedPreset()
                    .setTitle(`\`${toTitleCase(interaction.values[0])}\` Help Menu`)
                    .setDescription(`\`${categoryCommands.length}\` commands\n\n${list.join('\n')}`)
            ]
        })
    }
};