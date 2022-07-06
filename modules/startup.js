const fs = require('fs')
const logger = require('@modules/logger')
const { Sequelize } = require('sequelize')
const config = require('@modules/yaml')('config')
const axios = require('axios')

module.exports = async (client) => {
    if (!process.env.TOKEN) {
        logger.error(`No TOKEN environment variable detected!`)
        process.exit()
    }
    
    if (!fs.existsSync('commands')) fs.mkdir('commands', (err) => { if (err) { logger.error(err) } })
    if (!fs.existsSync('config')) fs.mkdir('config', (err) => { if (err) { logger.error(err) } })
    if (!fs.existsSync('src')) fs.mkdir('src', (err) => { if (err) { logger.error(err) } })
    
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
        logger.info('Database connection has been successfully established.')
    } catch (error) {
        logger.error(`Unable to connect to the database: ${error}`)
        process.exit()
    }
    
    require('@modules/commands')(client)
    require('@modules/cli')(client)
    
    client.once('ready', async () => {
        logger.info(`Logged in as: ${client.user.username}#${client.user.discriminator}`)
        logger.info(`READY (in ${Math.floor(process.uptime())}s)`)
    
        let package = JSON.parse(fs.readFileSync('package.json').toString())
    
        if (config.updates.check) {
            await axios.get(`${config.updates.repo}/releases`, {}, { params: { 'accept': 'application/vnd.github.v3+json' } })
                .then(async (data) => {
                    if (package.version < data.data[0].tag_name) {
                        logger.warn(`
    A new framework version is availiable, please update:
    Version: ${data.data[0].name} (${package.version} -> ${data.data[0].tag_name})
    Released Date: ${data.data[0].created_at}
    URL: ${data.data[0].html_url}
                    `)
                    }
                })
        }
    
    
        if (!package.setup) {
            logger.info(`
    Welcome to Aestehtic - a Discord bot made using Discord.js v13
    Here are the steps you need to take to setup your bot:
    1. Navigate to the Discord Developer Portal, click your application that you created for the bot
    2. Click OAuth2 and select the 'bot' and 'applications.commands' scopes and select the desired permissions
    3. Copy the link and paste it into your browser.
    4. You are done
            `)
    
            package.setup = true
            fs.writeFileSync('package.json', JSON.stringify(package, null, 4))
        }
    })
    
    client.on('debug', m => logger.debug(m))
    client.on('warn', m => logger.warn(m))
    client.on('error', m => logger.error(m))
}