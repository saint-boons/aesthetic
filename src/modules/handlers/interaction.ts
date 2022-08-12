import { Client, Interaction } from 'discord.js';

import { logger, commands } from '@/modules/utils';

export default async (client: Client, interaction: Interaction) => {
    let command

    switch (interaction.type) {
        case 2: //ApplicationCommand
            command = commands.collection.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(client, interaction);
            } catch (error) {
                logger.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
            break
        case 3: //MessageComponent
            command = commands.collection.get(interaction.customId.replace(/:([\s\S]*)$/, ''));
            let id = interaction.customId.replace(/([\s\S]*):/, '')

            if (!command) return;

            try {
                await command[id](client, interaction)
            } catch(error) {
                await interaction.reply({ content: 'There was an error while processing this action!', ephemeral: true });
            }
            break
        default:
            //1: Ping
            //4: ApplicationCommandAutocomplete
            //5: ModalSubmit
            break
    }

    return
}