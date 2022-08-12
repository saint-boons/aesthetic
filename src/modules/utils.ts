import fs from 'fs';
import pino from 'pino';
import { Collection, EmbedBuilder } from 'discord.js';

import yaml from '@/modules/yaml'

export const logger = pino()

export const config: any = yaml('src/config.yaml')

let collection: Collection<string, any> = new Collection()
let list: Array<string> = []
let categories: Array<string> = []
let structure: any = {}

for (const category of fs.readdirSync('src/commands').filter((directory: string) => !directory.match(/\.[0-9a-z]+$/i))) {
    categories.push(category)
    structure[category] = []
    for (const file of fs.readdirSync(`src/commands/${category}`).filter(file => file.endsWith('.ts'))) {
        list.push(file.slice(0, -3))
        structure[category].push(file.slice(0, -3))
        collection.set(file.slice(0, -3), require(`@/commands/${category}/${file}`).default)
    }
}

export const commands = {
    collection: collection,
    list: list,
    categories: categories,
    structure: structure
}

export function embedPreset(type?: string) {
    let embed = new EmbedBuilder().setFooter({ text: config.embed.footer.text, iconURL: config.embed.footer.icon });

    switch (type) {
        case 'warn':
            embed.setColor(config.embed.color.warn);
            break
        case 'error':
            embed.setColor(config.embed.color.error);
            break
        default:
            embed.setColor(config.embed.color.default);
            break
    };
    return embed
}

export function toTitleCase(string: string) {
    return string.replace(/\b\S/g, (t) => t.toUpperCase())
}