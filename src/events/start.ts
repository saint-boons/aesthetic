import { Client, GatewayIntentBits } from 'discord.js';
import { Sequelize } from 'sequelize';

import { logger, config } from '@/modules/utils';
import ready from '@/events/ready';

export default async () => {
    if (!process.env.TOKEN) {
        logger.error(`No TOKEN environment variable detected!`)
        process.exit()
    }

    let sequelize
    if (config.method == 'sqlite') {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: 'src/db.sqlite',
            logging: logger.debug.bind(logger)
        })
    } else {
        sequelize = new Sequelize(config.database, config.username, config.password, {
            host: config.host,
            dialect: config.method,
            logging: logger.debug.bind(logger)
        });
    }
    
    try {
        await sequelize.authenticate()
        logger.info(`Database connection has been successfully established using ${config.method}.`)
    } catch (error) {
        logger.error(`Unable to connect to the database: ${error}`)
        process.exit()
    }

    const client = await new Client({ intents: [GatewayIntentBits.Guilds] });

    client.once('ready', () => {
        ready(client);
    });

    client.on('debug', m => logger.debug(m))
    client.on('warn', m => logger.warn(m))
    client.on('error', m => logger.error(m))

    client.login(process.env.TOKEN);
}