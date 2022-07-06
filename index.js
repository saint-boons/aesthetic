require('events').EventEmitter.defaultMaxListeners = 50
require('module-alias/register')
require('dotenv').config()

const { Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

require(`@modules/startup.js`)(client)

client.login(process.env.TOKEN)