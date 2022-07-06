const fs = require('fs')
const yaml = require('js-yaml')
const logger = require('@modules/logger')

const paths = {
    'config': 'config/config.yaml',
}

module.exports = (path) => {
    path = paths[`${path}`]
    try {
        return yaml.load(fs.readFileSync(path, 'utf8'))
    } catch (err) {
        return logger.error(err)
    }
}