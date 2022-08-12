import fs from 'fs';
import axios from 'axios';
import { Client } from 'discord.js';

import { logger, config, commands } from '@/modules/utils';
import handleInteraction from '@/handlers/interaction'

export default async (client: Client) => {
    if (!client.user || !client.application) return;

    for (const guild of await client.guilds.fetch()) {
        await client.application.commands.set(commands.collection.map(({ execute, ...data }) => data.data)), guild[1].id;
    };

    logger.info(`Logged in as: ${client.user.username}#${client.user.discriminator}`);
    logger.info(`READY (in ${Math.floor(process.uptime())}s)`);

    let packagejson = JSON.parse(fs.readFileSync('package.json').toString());

    if (config.updates.check) {
        await axios.get(`${config.updates.repo}/releases`, { params: { 'accept': 'application/vnd.github.v3+json' } })
            .then(async (data) => {
                if (packagejson.version < data.data[0].tag_name) {
                    logger.warn(`A new version is availiable!
Version: ${data.data[0].name} (${packagejson.version} -> ${data.data[0].tag_name})
Released Date: ${data.data[0].created_at}
URL: ${data.data[0].html_url}`)
                }
            });
    };


    if (!packagejson.setup) {
        logger.info(`
Welcome to Aestehtic - a Discord bot made using Discord.js v13
Here are the steps you need to take to setup your bot:
1. Navigate to the Discord Developer Portal, click your application that you created for the bot
2. Click OAuth2 and select the 'bot' and 'applications.commands' scopes and select the desired permissions
3. Copy the link and paste it into your browser.
4. You are done`);

        packagejson.setup = true;
        fs.writeFileSync('package.json', JSON.stringify(packagejson, null, 4));
    }

    client.on('interactionCreate', async (interaction) => {
        handleInteraction(client, interaction)
    });
}