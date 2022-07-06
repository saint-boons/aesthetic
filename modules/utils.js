const fs = require('fs')
const config = require('@modules/yaml')('config')
const Discord = require('discord.js')

module.exports.embed = (args) => {
    let embed = new Discord.MessageEmbed()
    if (args.preset) {
        switch (args.preset) {
            case 'default':
                embed.setColor(config.embed.color.default)
                break
            case 'warn':
                embed.setColor(config.embed.color.warn)
                if (args.title) embed.setTitle(`Warn: ${args.title}`)
                break
            case 'error':
                embed.setColor(config.embed.color.error)
                if (args.title) embed.setTitle(`Error: ${args.title}`)
                break
        }
        embed.setFooter({ text: config.embed.footer.text, iconURL: config.embed.footer.icon })
    }
    if (args.title) embed.setTitle(args.title)
    if (args.color) {
        if (args.color === 'default') {
            embed.setColor(config.embed.color.default)
        } else {
            embed.setColor(args.color)
        }
    }
    if (args.description) embed.setDescription(args.description)
    if (args.fields) embed.addFields(args.fields)
    if (args.footer) {
        if (args.footer === 'default') {
            embed.setFooter({ text: config.embed.footer.text, iconURL: config.embed.footer.icon })
        } else {
            embed.setFooter(args.footer)
        }
    }
    if (args.image) embed.setImage(args.image)
    if (args.thumbnail) embed.setThumbnail(args.thumbnail)
    if (args.timestamp) {
        if (args.timestamp === 'now') {
            embed.setTimestamp()
        } else {
            embed.setTimestamp(args.timestamp)
        }
    }
    if (args.url) embed.setURL(args.url)
    if (args.author) embed.setAuthor(args.author)
    return embed
}

module.exports.button = (args) => {
    let button = new Discord.MessageButton()
        .setCustomId(args.id)
        .setLabel(args.label)
        .setStyle(args.style)
    if (args.disabled) button.setDisabled(args.disabled)
    if (args.emoji) button.setEmoji(args.emoji)
    return button
}

module.exports.menu = (args) => {
    let menu = new Discord.MessageSelectMenu()
        .setCustomId(args.id)
        .setPlaceholder(args.placeholder)
        .addOptions(args.options)
    if (args.min) menu.setMinValues(args.min)
    if (args.max) menu.setMaxValues(args.max)
    return menu
}

module.exports.row = (components) => {
    const row = new Discord.MessageActionRow()
        .addComponents(components)
    return row
}

module.exports.getCommandCategories = () => {
    return fs.readdirSync('commands').filter(directory => !directory.startsWith('.') && !directory.match(/\.[0-9a-z]+$/i))
}

module.exports.getCommandFiles = (category) => {
    if (category.match(/\.[0-9a-z]+$/i)) return
    let categories = fs.readdirSync('commands').filter(directory => !directory.startsWith('.'))
    categories.push('')
    if (!categories.includes(category)) return
    if (category === '') return fs.readdirSync(`commands`).filter(file => file.endsWith('.js'))
    return fs.readdirSync(`commands/${category}`).filter(file => file.endsWith('.js'))
}

module.exports.getCommand = (category, command) => {
    let categories = fs.readdirSync('commands').filter(directory => !directory.startsWith('.'))
    categories.push('')
    if (!categories.includes(category)) return
    if (category === '') return require(`../commands/${command}`)
    return require(`../commands/${category}/${command}`)
}

module.exports.getInteractionCategories = () => {
    return fs.readdirSync('interactions').filter(directory => !directory.startsWith('.') && !directory.match(/\.[0-9a-z]+$/i))
}

module.exports.getInteractionFiles = (category) => {
    if (category.match(/\.[0-9a-z]+$/i)) return
    let categories = fs.readdirSync('commands').filter(directory => !directory.startsWith('.'))
    categories.push('')
    if (!categories.includes(category)) return
    if (category === '') return fs.readdirSync(`interactions`).filter(file => file.endsWith('.js'))
    return fs.readdirSync(`interactions/${category}`).filter(file => file.endsWith('.js'))
}

module.exports.getInteraction = (category, command) => {
    let categories = fs.readdirSync('commands').filter(directory => !directory.startsWith('.'))
    categories.push('')
    if (!categories.includes(category)) return
    if (category === '') return require(`../interactions/${command}`)
    return require(`../interactions/${category}/${command}`)
}

module.exports.title = (str) => {
    return str.replace(/\b\S/g, (t) => t.toUpperCase())
}

module.exports.getGuild = (client, serverID) => {
    let guild = client.guilds.cache.get(`${serverID}`)
    return guild
}

module.exports.getUser = (client, userID) => {
    let user = client.users.cache.get(`${userID}`)
    return user
}

module.exports.getGuildMember = (client, userID, guildID) => {
    let guild = client.guilds.cache.get(`${guildID}`)
    let user = guild.members.cache.get(`${userID}`)
    return user
}

module.exports.randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}